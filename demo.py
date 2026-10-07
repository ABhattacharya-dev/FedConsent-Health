"""Prepare an isolated demo once, then serve it without changing the working database."""
import argparse
import html
import json
import os
from pathlib import Path


def backup(directory, store, manifest):
    rows = []
    for run in store.runs():
        final = run['rounds'][-1] if run['rounds'] else {}
        metrics = final.get('metrics') or {}
        rows.append(f"<tr><td>{html.escape(run['id'])}</td><td>{run['config']['noise']}</td>"
                    f"<td>{html.escape(run['status'])}</td><td>{metrics.get('auroc', 'Unavailable')}</td>"
                    f"<td>{final.get('epsilon_max') if final.get('epsilon_max') is not None else 'No DP'}</td><td>{run.get('attack', {}).get('auroc', 'Unavailable')}</td></tr>")
    evidence = {'manifest': manifest, 'experiments': store.runs(), 'audit': store.audit()}
    (directory / 'evidence.json').write_text(json.dumps(evidence, indent=2, allow_nan=False), encoding='utf-8')
    (directory / 'backup.html').write_text(
        '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width">'
        '<title>FedConsent Health — recorded evidence</title><style>body{font:16px system-ui;max-width:1100px;margin:40px auto;padding:20px;color:#173c35}table{border-collapse:collapse}td,th{padding:12px;border:1px solid #ccc;text-align:left}pre{white-space:pre-wrap;overflow-wrap:anywhere}div{overflow:auto}</style>'
        '<h1>FedConsent Health</h1><h2>Recorded demo evidence — not a live session</h2>'
        '<p>Actual saved experiments. Consent controls are unavailable in this offline backup. Epsilon is per run; no joint DP guarantee. Attack AUC near 0.5 is not proof of privacy.</p>'
        '<div><table><tr><th>Run</th><th>Noise</th><th>Status</th><th>Model AUROC</th><th>ε max</th><th>Attack AUROC</th></tr>'
        + ''.join(rows) + '</table></div><h2>Demo manifest</h2><pre>'
        + html.escape(json.dumps(manifest, indent=2)) + '</pre><h2>Consent audit</h2><pre>'
        + html.escape(json.dumps(store.audit(), indent=2)) + '</pre><p>Full configuration, accountant history and round eligibility: evidence.json in this folder.</p></html>', encoding='utf-8')


def prepare(directory):
    from backend.store import Store
    from federation.experiment import ExperimentConfig, execute, initialize
    if (directory / 'demo.db').exists():
        raise SystemExit('Demo database already exists. Serve it, or choose a new --directory; existing consent is never reset.')
    directory.mkdir(parents=True, exist_ok=True)
    store = Store(f"sqlite:///{(directory / 'demo.db').as_posix()}")
    data, _, fingerprint = initialize(store, os.getenv('FEDCONSENT_DATA_DIR', 'data'))
    manifest = {'dataset_fingerprint': fingerprint, 'runs': {}, 'scope': 'Recorded public-data simulation. DP randomness varies; configurations and workflow are fixed.'}
    for noise in (0, .8, 1.2, 2):
        result = execute(store, data, ExperimentConfig(noise=noise), artifacts=directory)
        manifest['runs'][str(noise)] = result['id']
        print(f"Measured noise {noise}: {result['id']}", flush=True)
    patient = store.records('A')[0]['patient_id']
    result = execute(store, data, ExperimentConfig(rounds=2), artifacts=directory,
                     round_hook=lambda n: store.consent(patient, 'withdrawn') if n == 2 else None)
    assert patient in result['rounds'][0]['hospitals']['A']['eligible_ids']
    assert patient not in result['rounds'][1]['hospitals']['A']['eligible_ids']
    manifest['withdrawal'] = {'patient': patient, 'run': result['id'], 'before': 256, 'after': 255}
    (directory / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    backup(directory, store, manifest)
    print(f"Ready: {directory}. Offline backup: backup.html", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['prepare', 'serve'])
    parser.add_argument('--directory', default='artifacts/submission')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    from dotenv import load_dotenv
    load_dotenv()
    directory = Path(args.directory).resolve()
    if args.action == 'prepare':
        prepare(directory)
    else:
        if not (directory / 'manifest.json').exists():
            raise SystemExit('Prepare this demo directory first.')
        if not Path('frontend/dist/index.html').exists():
            raise SystemExit('Build the frontend first: npm --prefix frontend run build')
        os.environ['FEDCONSENT_DATABASE_URL'] = f"sqlite:///{(directory / 'demo.db').as_posix()}"
        os.environ['FEDCONSENT_ARTIFACT_DIR'] = str(directory)
        import uvicorn
        uvicorn.run('backend.app:app', host='127.0.0.1', port=args.port)


if __name__ == '__main__':
    main()

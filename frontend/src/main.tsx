import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

type Metrics = {accuracy:number; auroc:number|null; f1:number; sensitivity:number|null; specificity:number|null; test_count:number; threshold:number};
type Hospital = {id:string; records:number; eligible:number; status:string; distribution:Record<string,number>|null};
type Patient = {patient_id:string; hospital:string; status:string; project:string; purpose:string; policy:string};
type Privacy = {epsilon:number; delta:number; noise_multiplier:number; clipping:number};
type Round = {round:number; metrics:Metrics|null; epsilon_max:number|null; hospitals:Record<string,{count:number; status:string; privacy?:Privacy|null}>};
type Run = {id:string; status:string; config:{noise:number; rounds:number; epochs:number; delta:number}; rounds:Round[]; baselines:Record<string,{metrics?:Metrics; status?:string}>; error:string|null; privacy_scope:string; started_at:string; evaluation?:string};
type Receipt = {record:Patient; eligible_now:boolean; history:{id:number; action:string; at:string}[]; rounds:{run_id:string; round:number; participation:string; privacy:Privacy|null}[]; withdrawal_explanation:string; raw_data:string; identity:string; initial_consent:string};

async function api<T>(path:string, body?:unknown):Promise<T> {
  const response = await fetch(`/api${path}`, body === undefined ? undefined : {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if (!response.ok) {
    const error = await response.json().catch(()=>({}));
    throw new Error(typeof error.detail === 'string' ? error.detail : `Request failed (${response.status})`);
  }
  return response.json();
}
const value = (v:number|null|undefined) => v == null ? 'Unavailable' : v.toFixed(3);

function Results({metrics}:{metrics:Metrics}) {
  return <span>Accuracy {value(metrics.accuracy)} · AUROC {value(metrics.auroc)} · F1 {value(metrics.f1)} · Recall {value(metrics.sensitivity)} · Specificity {value(metrics.specificity)} · Test n={metrics.test_count} · Threshold {value(metrics.threshold)}</span>;
}

function App() {
  const [view,setView] = useState('researcher');
  const [hospitals,setHospitals] = useState<Hospital[]>([]);
  const [runs,setRuns] = useState<Run[]>([]);
  const [patients,setPatients] = useState<Patient[]>([]);
  const [hospital,setHospital] = useState('A');
  const [patient,setPatient] = useState('');
  const [receipt,setReceipt] = useState<Receipt|null>(null);
  const [error,setError] = useState('');
  const [connectionError,setConnectionError] = useState('');
  const [message,setMessage] = useState('');
  const [pending,setPending] = useState(false);
  const [training,setTraining] = useState(false);
  const [noise,setNoise] = useState(0);
  const [rounds,setRounds] = useState(3);

  async function refresh() {
    const [h,r,health] = await Promise.all([api<Hospital[]>('/hospitals'),api<Run[]>('/experiments'),api<{busy:boolean}>('/health')]);
    setHospitals(h); setRuns(r); setTraining(health.busy);
  }
  useEffect(()=>{
    let alive = true;
    const poll = () => refresh().then(()=>{if(alive)setConnectionError('');}).catch(e=>{if(alive)setConnectionError(`Backend unavailable: ${e.message}. Displayed results may be stale.`);});
    void poll(); const timer = window.setInterval(poll,3000);
    return ()=>{alive=false; window.clearInterval(timer);};
  },[]);
  useEffect(()=>{
    let alive=true;
    api<Patient[]>(`/patients?hospital=${hospital}`).then(p=>{if(alive){setPatients(p);setPatient(p[0]?.patient_id??'');}}).catch(e=>setError(e.message));
    return ()=>{alive=false;};
  },[hospital,hospitals.reduce((n,h)=>n+h.records,0)]);
  useEffect(()=>{
    let alive=true; setReceipt(previous=>previous?.record.patient_id===patient?previous:null);
    if(patient) api<Receipt>(`/patients/${patient}/receipt`).then(r=>{if(alive)setReceipt(r);}).catch(e=>setError(e.message));
    return ()=>{alive=false;};
  },[patient,runs]);

  async function action(fn:()=>Promise<void>) {
    setPending(true);setError('');setMessage('');
    try {await fn();await refresh();} catch(e) {setError((e as Error).message);} finally {setPending(false);}
  }
  const completed = runs.filter(r=>r.status==='succeeded' && r.rounds.length);
  const withDP = completed.filter(r=>r.config.noise>0);
  return <main>
    <h1>FedConsent Health</h1>
    <p>Consent and training evidence for hospital research teams</p>
    <p><strong>Local educational simulation · Public data only · No clinical or compliance claims</strong></p>
    <p>Role switching below is a demo control, not authentication. Do not expose this server publicly.</p>
    <nav aria-label="Views"><button onClick={()=>setView('researcher')} aria-pressed={view==='researcher'}>Researcher dashboard</button>{' '}<button onClick={()=>setView('patient')} aria-pressed={view==='patient'}>Patient portal</button></nav>
    {error && <p role="alert">{error}</p>}
    {connectionError && <p role="alert">{connectionError}</p>}
    <p role="status" aria-live="polite">{pending?'Processing…':message}</p>
    {view==='researcher' ? <>
      <h2>Hospital simulation</h2>
      <button disabled={pending||training} onClick={()=>void action(async()=>{await api('/initialize',{});setMessage('Dataset ready. Existing withdrawals were preserved.');})}>Load / initialize public dataset</button>
      <p>First load downloads PneumoniaMNIST. Demo uses up to 256 training records per hospital; all models use the same official test split.</p>
      <table><caption>Logical hospital boundaries, not network isolation</caption><thead><tr><th>Hospital</th><th>Status</th><th>Eligible / records</th><th>Label distribution</th></tr></thead><tbody>{hospitals.map(h=><tr key={h.id}><th>{h.id}</th><td>{h.status}</td><td>{h.eligible} / {h.records}</td><td>{h.distribution?`Normal ${h.distribution.normal}; pneumonia ${h.distribution.pneumonia}`:'Load dataset to inspect'}</td></tr>)}</tbody></table>
      <h2>Run experiment</h2>
      <form onSubmit={e=>{e.preventDefault();void action(async()=>{const run=await api<{id:string}>('/experiments',{noise,rounds,epochs:2});setMessage(`Experiment queued: ${run.id}`);});}}>
        <label>Privacy configuration <select value={noise} onChange={e=>setNoise(Number(e.target.value))}><option value={0}>No DP — local baselines + federation</option><option value={.8}>DP noise 0.8</option><option value={1.2}>DP noise 1.2</option><option value={2}>DP noise 2.0</option></select></label>{' '}
        <label>Rounds <input type="number" min={1} max={10} value={rounds} onChange={e=>setRounds(Number(e.target.value))}/></label>{' '}
        <button disabled={pending||training||!hospitals.some(h=>h.records)}>Start training</button>
      </form>
      <p>{training?'Training/initialization in progress. Consent changes remain available.':'No active job.'}</p>
      <p>Noise settings are experimental, not medical safety thresholds. Epsilon is measured after training at delta 0.00001. Non-DP comparisons mean this demo has no joint DP guarantee.</p>
      <p>Privacy accounting is record-level and conditional on public cohort metadata. Secure RNG is disabled for this local research demonstration.</p>
      <h2>Experiment evidence</h2>
      {!runs.length && <p>No experiments yet. Initialize the dataset, then run the non-DP baseline.</p>}
      {runs.map(r=><section key={r.id}><h3>{r.config.noise?`DP noise ${r.config.noise}`:'Non-DP'} — {r.status}</h3><p>Run {r.id} · {r.started_at} · round {r.rounds.length}/{r.config.rounds}</p>{r.error&&<p role="alert">{r.error}</p>}
        <p>{r.evaluation??'Legacy run: fixed classification threshold 0.5.'}</p>
        {Object.entries(r.baselines).map(([h,b])=><p key={h}>Hospital {h} local only: {b.metrics?<Results metrics={b.metrics}/>:b.status}</p>)}
        {r.rounds.map(round=><p key={round.round}>Federation round {round.round}: {round.metrics&&<Results metrics={round.metrics}/>} · ε max {value(round.epsilon_max)}{r.config.noise>0?` at δ ${r.config.delta}`:' (no DP)'}</p>)}
        <details><summary>Round eligibility and privacy configuration</summary><pre>{JSON.stringify(r.rounds.map(x=>({round:x.round,hospitals:Object.fromEntries(Object.entries(x.hospitals).map(([h,v])=>[h,{count:v.count,status:v.status,privacy:v.privacy}]))})),null,2)}</pre></details>
      </section>)}
      <h2>Privacy / utility comparison</h2>
      <p>Each point is a completed run. Compare configurations only when cohorts, rounds and training settings match.</p>
      {withDP.length===0?<p>No measured DP results yet.</p>:<><svg viewBox="0 0 420 240" width="420" style={{maxWidth:'100%'}} role="img" aria-label="Privacy utility plot: x is epsilon, y is AUROC"><line x1="45" y1="205" x2="400" y2="205" stroke="currentColor"/><line x1="45" y1="205" x2="45" y2="15" stroke="currentColor"/><text x="170" y="235">ε (lower: more privacy)</text><text x="0" y="12">AUROC</text><text x="15" y="205">0</text><text x="15" y="25">1</text>{withDP.map(r=>{const last=r.rounds.at(-1)!;const epsilon=last.epsilon_max??0;const max=Math.max(...withDP.map(x=>x.rounds.at(-1)!.epsilon_max??0),1);return <g key={r.id}><circle cx={45+epsilon/max*330} cy={205-(last.metrics?.auroc??0)*180} r="5" fill="currentColor"><title>{`Noise ${r.config.noise}; epsilon ${value(epsilon)}; AUROC ${value(last.metrics?.auroc)}`}</title></circle></g>;})}</svg>
        <table><caption>Exact measured values (accessible alternative to plot)</caption><thead><tr><th>Noise</th><th>ε max</th><th>δ</th><th>AUROC</th></tr></thead><tbody>{withDP.map(r=><tr key={r.id}><td>{r.config.noise}</td><td>{value(r.rounds.at(-1)!.epsilon_max)}</td><td>{r.config.delta}</td><td>{value(r.rounds.at(-1)!.metrics?.auroc)}</td></tr>)}</tbody></table></>}
    </>:<>
      <h2>Patient consent and receipt</h2>
      <label>Hospital <select disabled={pending} value={hospital} onChange={e=>setHospital(e.target.value)}>{['A','B','C'].map(h=><option key={h}>{h}</option>)}</select></label>{' '}
      <label>Simulated record <select disabled={pending} value={patient} onChange={e=>setPatient(e.target.value)}>{patients.map(p=><option key={p.patient_id}>{p.patient_id}</option>)}</select></label>
      {!patient&&<p>Initialize the dataset in the researcher view first.</p>}
      {patient&&!receipt&&<p>Loading receipt…</p>}
      {receipt&&<><p>{receipt.identity} {receipt.initial_consent}</p><dl><dt>Research project</dt><dd>{receipt.record.project}</dd><dt>Purpose</dt><dd>{receipt.record.purpose}</dd><dt>Policy</dt><dd>{receipt.record.policy}</dd><dt>Consent</dt><dd>{receipt.record.status}</dd><dt>Eligible for next round</dt><dd>{receipt.eligible_now?'Yes':'No'}</dd></dl>
        <button disabled={pending} onClick={()=>void action(async()=>{await api(`/patients/${patient}/consent`,{status:receipt.record.status==='active'?'withdrawn':'active'});setReceipt(await api(`/patients/${patient}/receipt`));setMessage('Consent saved. The next round recalculates eligibility.');})}>{receipt.record.status==='active'?'Withdraw consent':'Grant consent'}</button>
        <p>{receipt.withdrawal_explanation}</p><p>{receipt.raw_data}</p>
        <h3>Consent history</h3>{receipt.history.length?<ul>{receipt.history.map(a=><li key={a.id}>{a.at}: {a.action}</li>)}</ul>:<p>No consent changes. Initial active consent was simulated.</p>}
        <h3>Recorded round eligibility</h3>{receipt.rounds.length?<ul>{receipt.rounds.map(r=><li key={`${r.run_id}-${r.round}`}>Run {r.run_id}, round {r.round}: {r.participation} {r.privacy?`ε ${value(r.privacy.epsilon)}, δ ${r.privacy.delta}`:'No DP'}</li>)}</ul>:<p>No recorded round eligibility yet.</p>}
      </>}
    </>}
  </main>;
}

createRoot(document.getElementById('root')!).render(<App/>);

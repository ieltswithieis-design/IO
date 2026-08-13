/* =========================================================
   IEIS.IO SUPABASE AUTHENTICATION
   ========================================================= */

const IEIS_SUPABASE_URL =
  "https://cfozjhxhaideltbmtiqg.supabase.co";

const IEIS_SUPABASE_KEY =
  "sb_publishable_YqJ217yNV8E2gt7gZLot9Q_7YLko7_j";

const ieisSupabase =
  window.supabase.createClient(
    IEIS_SUPABASE_URL,
    IEIS_SUPABASE_KEY
  );


/* =========================================================
   SUPABASE SIGN UP
   ========================================================= */

async function supabaseRegister(name, email, password, phone, country, qualification) {

  const { data, error } =
    await ieisSupabase.auth.signUp({

      email: email,

      password: password,

      options: {
        data: {
          full_name: name,
          phone_number: phone || "",
          country: country || "",
          last_qualification: qualification || "",
          role: "student"
        }
      }

    });

  if (error) {
    throw error;
  }

  return data;
}


/* =========================================================
   SUPABASE SIGN IN
   ========================================================= */

async function supabaseLogin(email, password) {

  const { data, error } =
    await ieisSupabase.auth.signInWithPassword({

      email: email,

      password: password

    });

  if (error) {
    throw error;
  }

  return data;
}


/* =========================================================
   SUPABASE SIGN OUT
   ========================================================= */

async function supabaseLogout() {

  const { error } =
    await ieisSupabase.auth.signOut();

  if (error) {
    console.error(error);
  }

}


/* =========================================================
   EXISTING IEIS.IO CODE — KEEP THIS
   ========================================================= */

const $ = s => document.querySelector(s);
const app = $("#app");
const passages = window.__IEIS_DATA__.passages;
const tests = window.__IEIS_DATA__.tests;
const seedAccounts = window.__IEIS_DATA__.accounts;
const LS = {
  session:"ieis_session_v1", users:"ieis_users_v1", attempts:"ieis_attempts_v1",
  progress:"ieis_progress_v1", settings:"ieis_settings_v1"
};
const load = (k,d)=>{try{return JSON.parse(localStorage.getItem(k)) ?? d}catch{return d}};
const save = (k,v)=>localStorage.setItem(k,JSON.stringify(v));
let users = load(LS.users, seedAccounts);
let attempts = load(LS.attempts, []);
let currentExam = null;

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function logo(){return `<img src="assets/IEIS.IO.png" alt="IEIS.IO">`}
let authUser=null;
function session(){return authUser}
function user(){return authUser}
function setSession(u){
  authUser=u||null;
  if(u) save(LS.session,{userId:u.id,at:Date.now()});
  else localStorage.removeItem(LS.session);
}
async function logout(){
  try{await supabaseLogout()}catch(e){console.error(e)}
  setSession(null);
  currentExam=null;
  route("home");
}

function mobileBack(){
  if(currentExam){
    if(confirm("Leave this page? Your current reading test may be lost.")){
      currentExam=null;
      route(user()?"dashboard":"home");
    }
    return;
  }
  route(user()?"dashboard":"home");
}
window.mobileBack=mobileBack;

function toggleMobileMenu(){
  const menu=document.querySelector("#mobileMenu");
  const btn=document.querySelector("#mobileMenuBtn");
  if(!menu)return;
  const open=menu.classList.toggle("open");
  if(btn)btn.setAttribute("aria-expanded",open?"true":"false");
}
window.toggleMobileMenu=toggleMobileMenu;

function topbar(){
  const u=user();
  return `<header class="topbar ieis-responsive-topbar">
    <div class="brand">${logo()}<span>IELTS Academic Reading Platform</span></div>
    <div class="mobile-nav-tools">
      <button class="mobile-back-btn" onclick="mobileBack()" aria-label="Back">← <span>Back</span></button>
      <button id="mobileMenuBtn" class="hamburger-btn" onclick="toggleMobileMenu()" aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
    <nav class="nav desktop-nav">
      <button onclick="route('home')">Home</button>
      ${u?`<button onclick="route('dashboard')">Dashboard</button>`:""}
      ${u?`<button onclick="route('history')">History</button>`:""}
      ${u&&u.role!=="student"?`<button onclick="route('staff')">Staff</button>`:""}
      ${u?`<button class="btn light" onclick="logout()">Logout</button>`:`<button class="btn light" onclick="route('login')">Sign In</button><button class="btn" onclick="route('signup')">Sign Up</button>`}
    </nav>
    <nav id="mobileMenu" class="mobile-menu">
      <button onclick="toggleMobileMenu();route('home')">Home</button>
      ${u?`<button onclick="toggleMobileMenu();route('dashboard')">Dashboard</button>`:""}
      ${u?`<button onclick="toggleMobileMenu();route('history')">History</button>`:""}
      ${u&&u.role!=="student"?`<button onclick="toggleMobileMenu();route('staff')">Staff</button>`:""}
      ${u?`<button class="btn light" onclick="toggleMobileMenu();logout()">Logout</button>`:`<button class="btn light" onclick="toggleMobileMenu();route('login')">Sign In</button><button class="btn" onclick="toggleMobileMenu();route('signup')">Sign Up</button>`}
    </nav>
  </header>`
}

function renderHome(){
  app.innerHTML = `${topbar()}<section class="hero"><div class="hero-grid">
    <div><div class="kicker">IEIS.IO • Independent IELTS Practice</div><h1>Academic Reading, built for serious preparation.</h1>
    <p>Run timed 60-minute practice examinations with three passages and exactly 40 questions, review performance, build consistency and explore a searchable library of 3,000+ passages.</p>
    <div class="actions"><button class="btn" onclick="${user()?"route('start')":"route('login')"}">Start Reading Test</button><button class="btn light" onclick="route('library')">Explore Passage Library</button></div></div>
    <div class="hero-logo">${logo()}</div></div></section>
    <main class="container"><div class="grid grid-4">
      ${[['3,000+','Passages'],['100','Teaching Tests'],['40','Questions / Test'],['60 min','Exam Timer']].map(x=>`<div class="card"><div class="kicker">${x[1]}</div><div class="stat">${x[0]}</div></div>`).join('')}
    </div>
    <div style="margin-top:30px" class="grid grid-3">
      <div class="card"><h3>Authentic exam flow</h3><p class="muted">Three passages, 13 + 13 + 14 questions, persistent navigation and auto-save.</p></div>
      <div class="card"><h3>Detailed review</h3><p class="muted">See answers, evidence, explanations, passage-level performance and question-type accuracy.</p></div>
      <div class="card"><h3>Professional administration</h3><p class="muted">Staff and admin roles can inspect students, attempts, passages and tests.</p></div>
    </div>
    <footer><strong>IEIS.IO</strong> — IELTS Preparation & Examination Platform<br><br>IEIS.IO is an independent IELTS preparation and practice platform. IELTS is a trademark of its respective owners. Practice tests and materials on this platform are independently produced.</footer>
    </main>`;
}

function renderLogin(){
  app.innerHTML = `<div class="auth-wrap"><div class="auth-shell">
    <section class="auth-brand-panel">${logo()}<h2>IELTS Academic Reading</h2><p>Focused practice, timed examinations and structured performance review by IEIS.IO.</p></section>
    <section class="auth-form-panel">
      <div class="kicker">Welcome back</div><h1>Sign in to IEIS.IO</h1><p class="muted">Continue your reading preparation from your personal dashboard.</p>
      <div id="msg"></div>
      <form onsubmit="event.preventDefault();login()">
        <div class="field"><label>Email address</label><input id="email" type="email" autocomplete="email" placeholder="you@example.com" required></div>
        <div class="field"><label>Password</label><input id="password" type="password" autocomplete="current-password" placeholder="Enter your password" required></div>
        <button class="btn" style="width:100%">Sign In</button>
      </form>
      <div class="auth-links"><span class="muted">New to IEIS.IO?</span><button class="btn-ghost" onclick="route('signup')">Create an account</button></div>
      <div class="auth-links"><button class="btn-ghost" onclick="route('home')">← Back to home</button></div>
    </section>
  </div></div>`;
}
async function login(){
  const email=$("#email").value.trim().toLowerCase();
  const password=$("#password").value;
  const msg=$("#msg");
  msg.innerHTML='<div class="notice">Signing in…</div>';
  try{
    const data=await supabaseLogin(email,password);
    if(!data?.user)throw new Error("Login failed.");
    const u=data.user;
    setSession({id:u.id,name:u.user_metadata?.full_name||email.split("@")[0],email:u.email||email,role:u.user_metadata?.role||"student",country:u.user_metadata?.country||"",qualification:u.user_metadata?.last_qualification||"",createdAt:u.created_at});
    route(user().role!=="student"?"staff":"dashboard");
  }catch(e){
    msg.innerHTML='<div class="notice error">'+escapeHtml(e.message||"Incorrect email or password.")+'</div>';
  }
}

function renderSignup(){
  app.innerHTML=`<div class="auth-wrap"><div class="auth-shell">
    <section class="auth-brand-panel">${logo()}<h2>Build your IELTS routine</h2><p>Create a student account to save practice results, monitor progress and return to your reading tests.</p></section>
    <section class="auth-form-panel">
      <div class="kicker">Get started</div><h1>Create your IEIS.IO account</h1><p class="muted">Your student account keeps your practice history in one place.</p>
      <div id="msg"></div>
      <form onsubmit="event.preventDefault();signup()">
        <div class="field"><label>Full name</label><input id="name" autocomplete="name" placeholder="Your full name" required></div>
        <div class="field"><label>Email address</label><input id="email" type="email" autocomplete="email" placeholder="you@example.com" required></div>
        <div class="grid grid-2">
          <div class="field"><label>Password</label><input id="password" type="password" autocomplete="new-password" minlength="8" placeholder="Minimum 8 characters" required></div>
          <div class="field"><label>Confirm password</label><input id="confirm" type="password" autocomplete="new-password" placeholder="Repeat password" required></div>
        </div>
        <div class="field"><label>Phone number</label><input id="phone" type="text" inputmode="tel" autocomplete="tel" placeholder="Enter your phone number" required></div>
        <div class="field"><label>Last qualification</label><input id="qualification" type="text" autocomplete="off" placeholder="e.g. Intermediate, A Levels, Bachelor's" required></div>
        <div class="field"><label>Country <span class="muted">(optional)</span></label><input id="country" placeholder="Country"></div>
        <label style="font-size:13px;line-height:1.5"><input id="terms" type="checkbox" required> I agree to the terms and privacy policy.</label>
        <button class="btn" style="width:100%;margin-top:18px">Create Student Account</button>
      </form>
      <div class="auth-links"><span class="muted">Already registered?</span><button class="btn-ghost" onclick="route('login')">Sign in</button></div>
      <div class="auth-links"><button class="btn-ghost" onclick="route('home')">← Back to home</button></div>
    </section>
  </div></div>`;
}
async function signup(){
  const name=$("#name").value.trim();
  const email=$("#email").value.trim().toLowerCase();
  const p=$("#password").value;
  const c=$("#confirm").value;
  const phone=$("#phone").value.trim();
  const qualification=$("#qualification").value.trim();
  const msg=$("#msg");
  if(!name||!email||!phone||!qualification){msg.innerHTML='<div class="notice error">Please enter your full name, email address, phone number and last qualification.</div>';return}
  if(p.length<8){msg.innerHTML='<div class="notice error">Password must contain at least 8 characters.</div>';return}
  if(p!==c){msg.innerHTML='<div class="notice error">Passwords do not match.</div>';return}
  if(!$("#terms").checked){msg.innerHTML='<div class="notice error">Please agree to the terms and privacy policy.</div>';return}
  msg.innerHTML='<div class="notice">Creating your IEIS.IO account…</div>';
  try{
    const data=await supabaseRegister(name,email,p,phone,$("#country").value.trim(),qualification);
    if(!data?.user)throw new Error("Registration failed.");
    if(!data.session){
      msg.innerHTML='<div class="notice">Account created successfully. Please check your email, confirm your account, then sign in.</div>';
      return;
    }
    const u=data.user;
    setSession({id:u.id,name:u.user_metadata?.full_name||name,email:u.email||email,phone:u.user_metadata?.phone_number||phone,qualification:u.user_metadata?.last_qualification||qualification,role:u.user_metadata?.role||"student",country:u.user_metadata?.country||$("#country").value.trim(),createdAt:u.created_at});
    route("dashboard");
  }catch(e){
    msg.innerHTML='<div class="notice error">'+escapeHtml(e.message||"Registration failed.")+'</div>';
  }
}

function requireAuth(){if(!user()){route("login");return false}return true}
function renderDashboard(){
  if(!requireAuth())return; const u=user(); const mine=attempts.filter(a=>a.userId===u.id);
  const avg=mine.length?Math.round(mine.reduce((s,a)=>s+a.score,0)/mine.length):0, best=mine.length?Math.max(...mine.map(a=>a.score)):0;
  app.innerHTML=`${topbar()}<main class="container"><div class="dash-head"><div><div class="kicker">Student Dashboard</div><h1 style="margin:5px 0;color:var(--navy)">Welcome, ${escapeHtml(u.name)}</h1><p class="muted">Build accuracy, speed and confidence with structured practice.</p></div><button class="btn" onclick="route('start')">Start Reading Test</button></div>
  <div class="grid grid-4">${[['Tests completed',mine.length],['Average score',avg+'/40'],['Highest score',best+'/40'],['Questions answered',mine.reduce((s,a)=>s+a.answered,0)]].map(x=>`<div class="card"><div class="kicker">${x[0]}</div><div class="stat">${x[1]}</div></div>`).join('')}</div>
  <div style="margin-top:22px" class="grid grid-2"><div class="card"><h3>Quick Actions</h3><div class="actions"><button class="btn" onclick="route('start')">Start Reading Test</button><button class="btn light" onclick="route('teaching')">Teaching Tests</button><button class="btn light" onclick="route('library')">Passage Library</button><button class="btn light" onclick="route('history')">View Results</button></div></div>
  <div class="card"><h3>Latest Attempt</h3>${mine.length?`<p><strong>${escapeHtml(mine.at(-1).title)}</strong></p><p class="muted">${new Date(mine.at(-1).date).toLocaleString()} · ${mine.at(-1).score}/40 · ${Math.round(mine.at(-1).score/40*100)}%</p>`:'<p class="muted">No completed attempts yet.</p>'}</div></div>
  <div class="card" style="margin-top:22px"><h3>Practice mode</h3><p class="muted">The local build persists accounts, attempts, answers and settings in this browser. For a public production deployment, connect the included architecture to a secure backend such as Supabase.</p></div>
  <div class="card" style="margin-top:22px"><h3>IELTS Academic Reading Score Guide</h3><p class="muted">Your 40-question reading score is converted to an Academic Reading practice band.</p>
  <table class="table band-table"><thead><tr><th>Band</th><th>Correct / 40</th></tr></thead><tbody>
  <tr><td>9.0</td><td>40</td></tr><tr><td>8.5</td><td>39</td></tr><tr><td>8.0</td><td>37–38</td></tr><tr><td>7.5</td><td>35–36</td></tr><tr><td>7.0</td><td>33–34</td></tr><tr><td>6.5</td><td>30–32</td></tr><tr><td>6.0</td><td>27–29</td></tr><tr><td>5.5</td><td>23–26</td></tr><tr><td>5.0</td><td>19–22</td></tr><tr><td>4.5</td><td>15–18</td></tr><tr><td>4.0</td><td>13–14</td></tr><tr><td>3.5</td><td>10–12</td></tr><tr><td>3.0</td><td>8–9</td></tr><tr><td>2.5</td><td>6–7</td></tr><tr><td>2.0</td><td>4–5</td></tr><tr><td>1.5</td><td>2–3</td></tr><tr><td>1.0</td><td>0–1</td></tr>
  </tbody></table></div></main>`;
}

function renderStart(){
 if(!requireAuth())return;
 app.innerHTML=`${topbar()}<main class="container"><div class="card" style="max-width:850px;margin:20px auto"><div class="kicker">Examination Instructions</div><h1 style="color:var(--navy)">Academic Reading Practice</h1>
 <div class="grid grid-3"><div><strong>60 minutes</strong><br><span class="muted">Total time</span></div><div><strong>40 questions</strong><br><span class="muted">13 + 13 + 14</span></div><div><strong>3 passages</strong><br><span class="muted">Academic reading</span></div></div>
 <hr style="border:0;border-top:1px solid var(--line);margin:22px 0"><p>You will read three academic passages and answer 40 questions. The timer starts when the examination begins. Answers are saved as you work. When the timer reaches zero, the examination is submitted automatically.</p>
 <ul><li>Passage 1: 13 questions</li><li>Passage 2: 13 questions</li><li>Passage 3: 14 questions</li><li>Review and flag questions before submitting.</li></ul>
 <label style="display:block;margin:22px 0"><input type="checkbox" id="ready"> I am ready to begin the examination.</label>
 <button class="btn" onclick="beginExam()">Start Examination</button> <button class="btn light" onclick="route('dashboard')">Cancel</button></div></main>`;
}
function beginExam(){
 if(!$("#ready").checked)return alert("Please confirm that you are ready to begin.");
 const t=tests[Math.floor(Math.random()*tests.length)];
 const ps=t.passages.map(id=>passages.find(p=>p.id===id));
 const questions=[];
 ps.forEach((p,pi)=>p.questions.slice(0,t.distribution[pi]).forEach((q,qi)=>questions.push({...q,number:questions.length+1,passageIndex:pi,passageId:p.id})));
 currentExam={test:t,passages:ps,questions,answers:{},flags:{},startedAt:Date.now(),endAt:Date.now()+60*60*1000};
 renderExam();
}

function renderExam(){
 const e=currentExam;if(!e)return;
 const qidx=Object.keys(e.answers).length;
 app.innerHTML=`<div class="exam-shell"><div class="exambar"><div class="brand">${logo()}</div><div class="exam-title"><strong>${escapeHtml(e.test.title)}</strong><span class="muted">Passage ${currentPassage()+1} · Questions ${rangeForPassage(currentPassage())}</span></div><div class="timer" id="timer">60:00</div><button class="btn danger" onclick="confirmSubmit()">Submit</button></div>
 <div class="exam-main"><section class="pane passage-pane" id="passagePane"></section><section class="pane question-pane"><div><strong>Question Navigator</strong><div class="navigator">${e.questions.map(q=>`<button class="navq ${e.answers[q.number]!==undefined?'answered':''} ${e.flags[q.number]?'flagged':''} ${q.number===1?'current':''}" id="nav-${q.number}" onclick="jumpQ(${q.number})">${q.number}</button>`).join('')}</div></div><div id="questions"></div></section></div>
 <div class="exam-footer"><span class="muted"><span id="answeredCount">${qidx}</span> of 40 questions answered</span><div class="actions"><button class="btn light" onclick="previousPassage()">Previous Passage</button><button class="btn secondary" onclick="nextPassage()">Next Passage</button></div></div></div>`;
 renderExamContent();
 tickTimer();
}
let examInterval=null, selectedQuestion=1;
function currentPassage(){return currentExam.questions.find(q=>q.number===selectedQuestion)?.passageIndex||0}
function rangeForPassage(pi){const qs=currentExam.questions.filter(q=>q.passageIndex===pi);return `${qs[0].number}–${qs.at(-1).number}`}
function renderExamContent(){
 const e=currentExam, pi=currentPassage(), p=e.passages[pi];
 $("#passagePane").innerHTML=`<div class="kicker">Passage ${pi+1}</div><h2 style="color:var(--navy)">${escapeHtml(p.title)}</h2><div class="muted" style="margin-bottom:20px">${escapeHtml(p.topic)} · ${p.difficulty}</div><div class="passage-text">${p.paragraphs.map(x=>`<p>${escapeHtml(x)}</p>`).join("")}</div>`;
 const q=currentExam.questions.find(x=>x.number===selectedQuestion);
 const qs=currentExam.questions.filter(x=>x.passageIndex===pi);
 $("#questions").innerHTML=qs.map(x=>questionHtml(x)).join("");
 document.querySelectorAll(".navq").forEach(n=>n.classList.toggle("current",Number(n.textContent)===selectedQuestion));
 $("#answeredCount").textContent=Object.keys(e.answers).length;
}
function questionHtml(q){
 const val=currentExam.answers[q.number]??"";
 let body="";
 if(["multiple_choice","true_false_ng","yes_no_ng"].includes(q.type)){
   body=q.options.map((o,i)=>`<label class="option"><input type="radio" name="q${q.number}" value="${escapeHtml(o)}" ${val===o?'checked':''} onchange="answerQ(${q.number},this.value)"> <span>${escapeHtml(o)}</span></label>`).join("");
 }else body=`<input class="text-answer" value="${escapeHtml(val)}" placeholder="Type your answer" oninput="answerQ(${q.number},this.value)">`;
 return `<div class="qcard" id="question-${q.number}"><div class="qhead"><div class="qnum">${q.number}</div><div style="flex:1"><div class="qtext">${escapeHtml(q.question)}</div>${q.word_limit?`<div class="muted" style="margin-top:5px">NO MORE THAN ${q.word_limit} WORDS</div>`:""}${body}</div><button class="btn-ghost" onclick="flagQ(${q.number})">⚑</button></div></div>`;
}
function answerQ(n,v){currentExam.answers[n]=v;$("#answeredCount").textContent=Object.keys(currentExam.answers).length;const nav=$("#nav-"+n);if(nav)nav.classList.add("answered");saveProgress()}
function flagQ(n){currentExam.flags[n]=!currentExam.flags[n];const nav=$("#nav-"+n);if(nav)nav.classList.toggle("flagged",currentExam.flags[n])}
function jumpQ(n){selectedQuestion=n;renderExamContent();setTimeout(()=>$("#question-"+n)?.scrollIntoView({behavior:"smooth",block:"center"}),20)}
function previousPassage(){const p=currentPassage();if(p>0){selectedQuestion=currentExam.questions.find(q=>q.passageIndex===p-1).number;renderExamContent()}}
function nextPassage(){const p=currentPassage();if(p<2){selectedQuestion=currentExam.questions.find(q=>q.passageIndex===p+1).number;renderExamContent()}else confirmSubmit()}
function saveProgress(){save(LS.progress,{testId:currentExam.test.id,answers:currentExam.answers,flags:currentExam.flags})}
function tickTimer(){
 clearInterval(examInterval);
 const update=()=>{
   if(!currentExam)return; const left=Math.max(0,currentExam.endAt-Date.now()), sec=Math.floor(left/1000);
   const m=String(Math.floor(sec/60)).padStart(2,"0"), s=String(sec%60).padStart(2,"0"), el=$("#timer");
   if(el){el.textContent=`${m}:${s}`;el.classList.toggle("warning",sec<=600&&sec>60);el.classList.toggle("danger",sec<=60)}
   if(left<=0){clearInterval(examInterval);submitExam(true)}
 };
 update(); examInterval=setInterval(update,250);
}
function confirmSubmit(){
 const answered=Object.keys(currentExam.answers).filter(k=>String(currentExam.answers[k]).trim()).length;
 if(confirm(`You have answered ${answered} of 40 questions.\n\nAre you sure you want to submit?`))submitExam(false);
}
function normalize(x){return String(x??"").trim().toLowerCase().replace(/\s+/g," ")}
function grade(q,ans){
 if(!ans)return false;
 if(q.accepted)return q.accepted.map(normalize).includes(normalize(ans));
 return normalize(q.answer)===normalize(ans);
}
function submitExam(auto){
 clearInterval(examInterval);
 const u=user(); let score=0; const detail=[];
 currentExam.questions.forEach(q=>{const ans=currentExam.answers[q.number]??"";const correct=grade(q,ans);if(correct)score++;detail.push({number:q.number,answer:ans,correct,correctAnswer:q.answer,explanation:q.explanation,evidence:q.evidence})});
 const a={id:"A-"+Date.now(),userId:u.id,testId:currentExam.test.id,title:currentExam.test.title,date:new Date().toISOString(),score,answered:Object.keys(currentExam.answers).filter(k=>String(currentExam.answers[k]).trim()).length,timeUsed:Math.round((Date.now()-currentExam.startedAt)/1000),details:detail};
 attempts.push(a);save(LS.attempts,attempts);localStorage.removeItem(LS.progress);
 currentExam=null; route("result",a.id);
}
function academicReadingBand(raw){
  const n=Math.max(0,Math.min(40,Number(raw)||0));
  // Standard IELTS Academic Reading practice conversion.
  // Exact raw-score boundaries can vary between test versions.
  if(n===40)return "9.0";
  if(n===39)return "8.5";
  if(n>=37)return "8.0";
  if(n>=35)return "7.5";
  if(n>=33)return "7.0";
  if(n>=30)return "6.5";
  if(n>=27)return "6.0";
  if(n>=23)return "5.5";
  if(n>=19)return "5.0";
  if(n>=15)return "4.5";
  if(n>=13)return "4.0";
  if(n>=10)return "3.5";
  if(n>=8)return "3.0";
  if(n>=6)return "2.5";
  if(n>=4)return "2.0";
  if(n>=2)return "1.5";
  return "1.0";
}
function academicReadingBandRange(b){
  const ranges={"9.0":"39–40","8.5":"37–38","8.0":"35–36","7.5":"33–34","7.0":"30–32","6.5":"27–29","6.0":"23–26","5.5":"19–22","5.0":"15–18","4.5":"13–14","4.0":"10–12","3.5":"8–9","3.0":"6–7","2.5":"4–5","2.0":"2–3","1.0":"0–1"};return ranges[b]||"—";
}
function renderResult(id){
 const a=attempts.find(x=>x.id===id), u=user();if(!a){route("history");return}
 const pct=Math.round(a.score/40*100), band=academicReadingBand(a.score);
 app.innerHTML=`${topbar()}<main class="container"><div class="card" style="max-width:1000px;margin:auto"><div class="kicker">Examination Result</div><h1 style="color:var(--navy);margin-bottom:5px">${escapeHtml(a.title)}</h1><p class="muted">${escapeHtml(u.name)} · ${new Date(a.date).toLocaleString()}</p>
 <div class="grid grid-4" style="margin:22px 0"><div class="card"><div class="kicker">Score</div><div class="stat">${a.score}/40</div></div><div class="card"><div class="kicker">Percentage</div><div class="stat">${pct}%</div></div><div class="card"><div class="kicker">Time Used</div><div class="stat">${Math.floor(a.timeUsed/60)}m</div></div><div class="card"><div class="kicker">IELTS Reading Band</div><div class="stat">${band}</div></div></div>
 <div class="notice"><strong>Academic Reading conversion:</strong> ${a.score}/40 → Band ${band}. This is an IELTS Academic Reading practice conversion; official IELTS scores are reported in whole and half bands and exact raw-score conversion can vary by test version.</div>
 <div class="card" style="margin:18px 0"><h3 style="margin-top:0">IELTS Academic Reading conversion</h3>
 <table class="table"><thead><tr><th>Correct answers / 40</th><th>Band</th></tr></thead><tbody>
 <tr><td>40</td><td>9.0</td></tr>
 <tr><td>39</td><td>8.5</td></tr>
 <tr><td>37–38</td><td>8.0</td></tr>
 <tr><td>35–36</td><td>7.5</td></tr>
 <tr><td>33–34</td><td>7.0</td></tr>
 <tr><td>30–32</td><td>6.5</td></tr>
 <tr><td>27–29</td><td>6.0</td></tr>
 <tr><td>23–26</td><td>5.5</td></tr>
 <tr><td>19–22</td><td>5.0</td></tr>
 <tr><td>15–18</td><td>4.5</td></tr>
 <tr><td>13–14</td><td>4.0</td></tr>
 <tr><td>10–12</td><td>3.5</td></tr>
 <tr><td>8–9</td><td>3.0</td></tr>
 <tr><td>6–7</td><td>2.5</td></tr>
 <tr><td>4–5</td><td>2.0</td></tr>
 <tr><td>2–3</td><td>1.5</td></tr>
 <tr><td>0–1</td><td>1.0</td></tr>
 </tbody></table></div>
 <h3>Detailed Review</h3><table class="table"><thead><tr><th>#</th><th>Your answer</th><th>Correct answer</th><th>Result</th></tr></thead><tbody>${a.details.map(d=>`<tr><td>${d.number}</td><td>${escapeHtml(d.answer||"Unanswered")}</td><td>${escapeHtml(d.correctAnswer)}</td><td><span class="pill">${d.correct?"Correct":"Incorrect"}</span></td></tr>`).join("")}</tbody></table>
 <div style="margin-top:20px" class="actions"><button class="btn" onclick="route('start')">Take Another Test</button><button class="btn light" onclick="route('history')">Attempt History</button></div></div></main>`;
}
function renderHistory(){
 if(!requireAuth())return;const mine=attempts.filter(a=>a.userId===user().id).sort((a,b)=>b.date.localeCompare(a.date));
 app.innerHTML=`${topbar()}<main class="container"><div class="kicker">Student History</div><h1 style="color:var(--navy)">Attempt History</h1><div class="card"><table class="table"><thead><tr><th>Test</th><th>Date</th><th>Score</th><th>Percentage</th><th>Time</th><th></th></tr></thead><tbody>${mine.map(a=>`<tr><td>${escapeHtml(a.title)}</td><td>${new Date(a.date).toLocaleDateString()}</td><td>${a.score}/40</td><td>${Math.round(a.score/40*100)}%</td><td>${Math.floor(a.timeUsed/60)}m</td><td><button class="btn light" onclick="route('result','${a.id}')">Review</button></td></tr>`).join("")||`<tr><td colspan="6">No attempts yet.</td></tr>`}</tbody></table></div></main>`;
}
function renderLibrary(){
 let list=passages, q="", topic="All", diff="All", page=1, pageSize=18;
 const featured=passages.slice(0,6);
 app.innerHTML=`${topbar()}<main class="container">
   <div class="dash-head"><div><div class="kicker">IEIS.IO Reading Library</div><h1 style="color:var(--navy);margin:5px 0">Academic Passage Library</h1><p class="muted">Explore ${passages.length.toLocaleString()} structured academic practice passages across multiple subject areas.</p></div><button class="btn" onclick="route('start')">Start Full Test</button></div>
   <div class="card" style="margin-bottom:18px"><div class="kicker">Featured reading</div><h2 style="margin:5px 0 15px;color:var(--navy)">Start with these passages</h2>
     <div class="grid grid-3">${featured.map(p=>`<div class="library-feature"><span class="pill">${p.difficulty}</span><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.paragraphs[0].replace(/^Paragraph A\\n/,"").slice(0,170))}…</p><div class="actions"><span class="muted">${escapeHtml(p.topic)}</span><button class="btn light" onclick="previewPassage('${p.id}')">Read Preview</button></div></div>`).join("")}</div>
   </div>
   <div class="card"><div class="grid grid-3">
     <div class="field"><label>Search the library</label><input id="search" placeholder="Search title, topic or keyword"></div>
     <div class="field"><label>Topic</label><select id="topic"><option>All</option>${[...new Set(passages.map(p=>p.topic))].map(x=>`<option>${escapeHtml(x)}</option>`).join("")}</select></div>
     <div class="field"><label>Difficulty</label><select id="diff"><option>All</option><option>Easy</option><option>Medium</option><option>Difficult</option></select></div>
   </div><div id="lib"></div></div>
 </main>`;
 const run=()=>{
   q=$("#search").value.toLowerCase().trim(); topic=$("#topic").value; diff=$("#diff").value; page=1;
   list=passages.filter(p=>(topic==="All"||p.topic===topic)&&(diff==="All"||p.difficulty===diff)&&(p.title.toLowerCase().includes(q)||p.topic.toLowerCase().includes(q)||p.tags.join(" ").toLowerCase().includes(q)));
   draw();
 };
 const draw=()=>{
   const totalPages=Math.max(1,Math.ceil(list.length/pageSize)); page=Math.min(page,totalPages);
   const shown=list.slice((page-1)*pageSize,page*pageSize);
   $("#lib").innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin:22px 0 12px"><div><strong>${list.length.toLocaleString()}</strong> matching passages</div><span class="muted">Page ${page} of ${totalPages}</span></div>
   <div class="grid grid-3">${shown.map(p=>`<div class="library-card"><div class="actions" style="justify-content:space-between"><span class="pill">${p.difficulty}</span><span class="muted">${escapeHtml(p.topic)}</span></div><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.paragraphs[0].replace(/^Paragraph A\\n/,"").slice(0,210))}…</p><div class="actions"><button class="btn light" onclick="previewPassage('${p.id}')">Preview Passage</button></div></div>`).join("") || '<div class="notice">No passages match your filters. Try another search or select “All”.</div>'}</div>
   <div class="actions" style="justify-content:center;margin-top:22px">${page>1?`<button class="btn light" onclick="libraryPage(${page-1})">Previous</button>`:""}${page<totalPages?`<button class="btn" onclick="libraryPage(${page+1})">Next</button>`:""}</div>`;
 };
 window.libraryPage=(p)=>{page=p;draw();window.scrollTo({top:420,behavior:"smooth"})};
 $("#search").oninput=run;$("#topic").onchange=run;$("#diff").onchange=run;run();
}
function previewPassage(id){
 const p=passages.find(x=>x.id===id);if(!p)return;
 app.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" id="modal"><div class="modal"><div class="kicker">${escapeHtml(p.topic)} · ${p.difficulty}</div><h2 style="color:var(--navy)">${escapeHtml(p.title)}</h2><div class="passage-text" style="font-size:15px;max-height:55vh;overflow:auto">${p.paragraphs.map(x=>`<p>${escapeHtml(x)}</p>`).join("")}</div><button class="btn light" onclick="$('#modal').remove()">Close</button></div></div>`);
}
function renderTeaching(){
 if(!requireAuth())return;app.innerHTML=`${topbar()}<main class="container"><div class="kicker">Teaching Tests</div><h1 style="color:var(--navy)">100 Complete Tests</h1><p class="muted">Every test is structurally validated at 3 passages and 40 questions: 13 + 13 + 14.</p><div class="grid grid-3">${tests.map(t=>`<div class="card"><span class="pill">${t.difficulty}</span><h3>${escapeHtml(t.title)}</h3><p class="muted">Passages: 3 · Questions: 40 · Distribution: 13/13/14</p><button class="btn" onclick="startSpecific('${t.id}')">Start Test</button></div>`).join("")}</div></main>`;
}
function startSpecific(id){
 const t=tests.find(x=>x.id===id),ps=t.passages.map(id=>passages.find(p=>p.id===id));const questions=[];ps.forEach((p,pi)=>p.questions.slice(0,t.distribution[pi]).forEach(q=>questions.push({...q,number:questions.length+1,passageIndex:pi,passageId:p.id})));
 currentExam={test:t,passages:ps,questions,answers:{},flags:{},startedAt:Date.now(),endAt:Date.now()+3600000};selectedQuestion=1;renderExam();
}
function renderStaff(){
 if(!requireAuth()||user().role==="student")return route("dashboard");
 app.innerHTML=`${topbar()}<main class="container"><div class="dash-head"><div><div class="kicker">Staff Administration</div><h1 style="color:var(--navy)">IEIS.IO Control Centre</h1><p class="muted">Role: ${user().role.toUpperCase()}</p></div></div>
 <div class="grid grid-4">${[['Total students',users.filter(u=>u.role==="student").length],['Tests available',tests.length],['Passages',passages.length],['Completed attempts',attempts.length]].map(x=>`<div class="card"><div class="kicker">${x[0]}</div><div class="stat">${x[1]}</div></div>`).join("")}</div>
 <div class="grid grid-2" style="margin-top:22px"><div class="card"><h3>Student Management</h3><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>${users.map(u=>`<tr><td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td>${u.role}</td></tr>`).join("")}</tbody></table></div>
 <div class="card"><h3>Test Validation</h3><p>Structural validator: <strong>${tests.every(t=>t.passages.length===3&&t.distribution.join(",")==="13,13,14")?"PASS":"FAIL"}</strong></p><p>Passage library: <strong>${passages.length>=3000?"PASS":"FAIL"}</strong></p><p>Every test has 3 passages: <strong>${tests.every(t=>t.passages.length===3)?"PASS":"FAIL"}</strong></p><p>Every test has 40 questions: <strong>${tests.every(t=>t.distribution.reduce((a,b)=>a+b,0)===40)?"PASS":"FAIL"}</strong></p></div></div></main>`;
}

function route(name,param){
 if(name==="home")renderHome();
 else if(name==="login")renderLogin();
 else if(name==="signup")renderSignup();
 else if(name==="dashboard")renderDashboard();
 else if(name==="start")renderStart();
 else if(name==="history")renderHistory();
 else if(name==="result")renderResult(param);
 else if(name==="library")renderLibrary();
 else if(name==="teaching")renderTeaching();
 else if(name==="staff")renderStaff();
}
window.route=route;
window.login=login;
window.signup=signup;
window.logout=logout;
window.beginExam=beginExam;
window.confirmSubmit=confirmSubmit;
window.answerQ=answerQ;
window.flagQ=flagQ;
window.jumpQ=jumpQ;
window.previousPassage=previousPassage;
window.nextPassage=nextPassage;
window.previewPassage=previewPassage;
window.startSpecific=startSpecific;

/* =========================================================
   MOBILE RESPONSIVE NAVIGATION
   ========================================================= */
(function installMobileNavigationStyles(){
  if(document.getElementById("ieis-mobile-nav-styles"))return;
  const style=document.createElement("style");
  style.id="ieis-mobile-nav-styles";
  style.textContent=`
    .ieis-responsive-topbar{position:relative;z-index:1000;}
    .mobile-nav-tools,.mobile-menu{display:none;}
    .hamburger-btn,.mobile-back-btn{border:1px solid rgba(15,31,61,.14);background:#fff;color:#0f1f3d;border-radius:10px;padding:9px 12px;font-size:18px;font-weight:700;cursor:pointer;}
    .mobile-back-btn{font-size:15px;}
    .mobile-menu{position:absolute;right:14px;top:calc(100% + 8px);min-width:210px;background:#fff;border:1px solid rgba(15,31,61,.12);border-radius:14px;box-shadow:0 14px 40px rgba(15,31,61,.16);padding:10px;}
    .mobile-menu.open{display:flex;flex-direction:column;gap:6px;}
    .mobile-menu button{width:100%;text-align:left;border:0;background:transparent;color:#0f1f3d;border-radius:9px;padding:12px 13px;font-size:15px;font-weight:650;cursor:pointer;}
    .mobile-menu button:hover{background:#f1f4f8;}
    .mobile-menu .btn{text-align:center;}
    @media(max-width:760px){
      .topbar{padding:12px 14px!important;}
      .brand span{display:none!important;}
      .brand img{max-height:42px!important;max-width:155px!important;}
      .desktop-nav{display:none!important;}
      .mobile-nav-tools{display:flex;align-items:center;gap:8px;margin-left:auto;}
      .mobile-back-btn{display:inline-flex;align-items:center;gap:5px;}
      .hamburger-btn{display:inline-flex;align-items:center;justify-content:center;width:44px;height:42px;padding:0;}
      .container{padding-left:14px!important;padding-right:14px!important;}
      .hero{padding:28px 14px!important;}
      .hero-grid{grid-template-columns:1fr!important;}
      .hero-logo{display:none!important;}
      .grid-4,.grid-3,.grid-2{grid-template-columns:1fr!important;}
      .dash-head{flex-direction:column!important;align-items:flex-start!important;gap:15px;}
      .auth-shell{grid-template-columns:1fr!important;margin:14px!important;}
      .auth-brand-panel{display:none!important;}
      .auth-form-panel{padding:24px 18px!important;}
      .test-grid{grid-template-columns:1fr!important;}
      .question-nav{position:static!important;}
      table{display:block;overflow-x:auto;white-space:nowrap;}
    }
    @media(max-width:420px){
      .mobile-back-btn span{display:none;}
      .mobile-back-btn{width:42px;height:42px;justify-content:center;padding:0;}
      .btn{max-width:100%;} 
      h1{font-size:30px!important;}
    }
  `;
  document.head.appendChild(style);
})();

async function restoreSupabaseSession(){
  try{
    const {data,error}=await ieisSupabase.auth.getSession();
    if(error)throw error;
    if(data?.session?.user){
      const u=data.session.user;
      setSession({id:u.id,name:u.user_metadata?.full_name||u.email?.split("@")[0]||"Student",email:u.email||"",role:u.user_metadata?.role||"student",country:u.user_metadata?.country||"",qualification:u.user_metadata?.last_qualification||"",createdAt:u.created_at});
    }else{
      setSession(null);
    }
  }catch(e){
    console.error("Supabase session restore failed:",e);
    setSession(null);
  }
  route(user()?"dashboard":"home");
}

ieisSupabase.auth.onAuthStateChange((event,sessionData)=>{
  if(sessionData?.user){
    const u=sessionData.user;
    setSession({id:u.id,name:u.user_metadata?.full_name||u.email?.split("@")[0]||"Student",email:u.email||"",role:u.user_metadata?.role||"student",country:u.user_metadata?.country||"",qualification:u.user_metadata?.last_qualification||"",createdAt:u.created_at});
  }else if(event==="SIGNED_OUT"){
    setSession(null);
    route("home");
  }
});

restoreSupabaseSession();

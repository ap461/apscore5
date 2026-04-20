import { Metadata } from "next";
import { createClient } from "@/prismicio";

export const metadata: Metadata = {
  title: "AP Test Practice — Free AP Exam Prep | APScore5",
  description: "Free AP practice questions for AP Biology, AP Human Geography, and AP CSP. Study 5 minutes a day, find your blind spots, and score a 5. No signup required.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://apscore5.com/" },
  openGraph: {
    title: "AP Test Practice — Free AP Exam Prep | APScore5",
    description: "Free AP practice questions for AP Biology, AP Human Geography, and AP CSP. Study 5 minutes a day and score a 5.",
    type: "website", url: "https://apscore5.com/", siteName: "APScore5", locale: "en_US",
    images: [{ url: "https://apscore5.com/images/apscore5-og-banner.png", width: 1200, height: 628 }],
  },
  twitter: { card: "summary_large_image", title: "AP Test Practice — Free AP Exam Prep | APScore5", description: "Free AP practice questions. Study 5 minutes a day and score a 5.", images: ["https://apscore5.com/images/apscore5-og-banner.png"] },
};

const sd = [
  {"@context":"https://schema.org","@type":"WebSite","name":"APScore5","url":"https://apscore5.com","description":"Free AP test practice questions, unit quizzes, and exam prep for AP Biology, AP Human Geography, and AP Computer Science Principles.","potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://apscore5.com/search?q={search_term_string}"},"query-input":"required name=search_term_string"}},
  {"@context":"https://schema.org","@type":"Organization","name":"APScore5","url":"https://apscore5.com","logo":"https://apscore5.com/images/AP_Score_5_Logo.png","sameAs":["https://www.youtube.com/@APScore5","https://www.tiktok.com/@apscore5"]},
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How are AP tests scored?","acceptedAnswer":{"@type":"Answer","text":"AP exams are scored on a 1-5 scale. A 5 signals college-level mastery. Most colleges grant credit for scores of 3, 4, or 5."}},{"@type":"Question","name":"How long is an AP test?","acceptedAnswer":{"@type":"Answer","text":"Most AP exams run between 2 and 3.5 hours. AP Biology is about 3 hours, AP Human Geography around 2h15m, and AP CSP about 2 hours."}},{"@type":"Question","name":"When are AP test scores released?","acceptedAnswer":{"@type":"Answer","text":"AP scores are typically released in mid-July, about two months after the exam window."}},{"@type":"Question","name":"Can AP tests be retaken?","acceptedAnswer":{"@type":"Answer","text":"Yes. Students can retake any AP exam in a subsequent year. You control which scores are reported to colleges."}},{"@type":"Question","name":"How many AP exams are there?","acceptedAnswer":{"@type":"Answer","text":"The College Board currently offers 38 AP courses and exams."}},{"@type":"Question","name":"Do AP test scores matter for college?","acceptedAnswer":{"@type":"Answer","text":"Yes. Strong AP scores (3-5) can earn college credit or placement out of introductory courses."}},{"@type":"Question","name":"Which AP test is the hardest?","acceptedAnswer":{"@type":"Answer","text":"AP Physics C, AP Chemistry, and AP Calculus BC consistently have the lowest 5-rates."}},{"@type":"Question","name":"What is the easiest AP exam?","acceptedAnswer":{"@type":"Answer","text":"AP Human Geography, AP Computer Science Principles, and AP Environmental Science are often cited as most accessible."}}]},
];

const faqs = [
  {q:"How are AP tests scored?",a:"AP exams are scored on a 1-5 scale. A 5 signals college-level mastery. Raw scores from multiple-choice and free-response sections are combined using a formula that varies by exam. Most colleges grant credit for scores of 3, 4, or 5."},
  {q:"How long is an AP test?",a:"Most AP exams run between 2 and 3.5 hours. AP Biology is about 3 hours, AP Human Geography is around 2 hours 15 minutes, and AP CSP is about 2 hours."},
  {q:"When are AP test scores released?",a:"AP scores are typically released in mid-July, about two months after the exam window. You can view scores through the College Board online score portal."},
  {q:"Can AP tests be retaken?",a:"Yes. Students can retake any AP exam in a subsequent year. You cannot retake the same exam in the same year. If you score higher, you control which scores are reported to colleges."},
  {q:"How many AP exams are there?",a:"The College Board currently offers 38 AP courses and exams across sciences, social sciences, math, English, history, world languages, and the arts."},
  {q:"Do AP test scores matter for college?",a:"Yes. Strong AP scores (3-5) can earn college credit or placement out of introductory courses, saving tuition and time."},
  {q:"Which AP test is the hardest?",a:"AP Physics C, AP Chemistry, and AP Calculus BC consistently have the lowest 5-rates. Difficulty depends on your strengths and preparation."},
  {q:"What is the easiest AP exam?",a:"AP Human Geography, AP Computer Science Principles, and AP Environmental Science are often cited as most accessible for first-time AP students."},
];

export default async function Home() {
  return (
    <>
      {sd.map((s,i)=><script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(s)}}/>)}
      <div className="nav-wrap">
        <nav className="container nav">
          <a href="/" aria-label="APScore5 Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/AP_Score_5_Logo.png" alt="APScore5 logo" className="brand-logo"/>
          </a>
          <div className="nav-links">
            <a href="/courses" className="nav-link">AP Courses</a>
            <a href="/practice" className="nav-link">Practice</a>
            <a href="/daily" className="nav-link">Daily Questions</a>
            <a href="/dashboard" className="nav-link">Progress</a>
            <a href="/pricing" className="nav-link">Pricing</a>
          </div>
          <div className="nav-actions">
            <a href="/login" className="nav-login">Log in</a>
            <a href="/signup" className="btn btn-p">Start Free</a>
          </div>
        </nav>
      </div>
      <div className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-text">
              <div className="eyebrow"><span className="eydot"></span>Free AP Exam Prep — No Signup Required</div>
              <h1>Ahead in Class Today.<br/>A 5 on the AP Tomorrow.</h1>
              <p className="sub">Free AP practice questions, unit quizzes, and exam prep for <strong>AP Biology, AP Human Geography, and AP CSP.</strong> Study 5 minutes a day. Remove blind spots. Score a 5.</p>
              <div className="hbtns">
                <a href="/signup" className="btn btn-p">Create a free account</a>
                <a href="/courses" className="btn btn-s">Browse AP Courses</a>
              </div>
              <p className="note">✓ Free forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Start in 30 seconds</p>
              <div className="trust">
                <div className="tp">12,000+ <span>AP Practice Questions</span></div>
                <div className="tp">3 Courses <span>Biology · HUG · CSP</span></div>
                <div className="tp">5 min/day <span>Built for busy students</span></div>
                <div className="tp">Free <span>No credit card needed</span></div>
              </div>
            </div>
            <div className="qcard" role="region" aria-label="Sample AP practice question">
              <div className="ctop"><span className="tag">AP Biology · Unit 1</span><span className="qnum">Q 3 of 10</span></div>
              <div className="prog"><div className="progb" style={{width:"30%"}}></div></div>
              <p className="question">Which organelle is responsible for producing ATP through cellular respiration?</p>
              <div className="opts" id="hero-opts">
                <div className="opt" data-correct="false" tabIndex={0}><span className="letter">A</span><span>Nucleus</span></div>
                <div className="opt" data-correct="true" tabIndex={0}><span className="letter">B</span><span>Mitochondria</span></div>
                <div className="opt" data-correct="false" tabIndex={0}><span className="letter">C</span><span>Ribosome</span></div>
                <div className="opt" data-correct="false" tabIndex={0}><span className="letter">D</span><span>Golgi Apparatus</span></div>
              </div>
              <div className="feedback" id="hero-feedback"><strong>✓ Correct — Mitochondria</strong>Mitochondria are the powerhouse of the cell, converting glucose into ATP via cellular respiration. High-frequency AP Bio topic.</div>
              <div className="nudge" id="hero-nudge">Want 12,000+ questions like this? <a href="/signup">Create your free account →</a></div>
              <div className="nextbtn" id="hero-next"><button type="button">Next question →</button></div>
            </div>
          </div>
        </div>
      </div>
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat"><strong>12,000+</strong><span>AP Practice Questions</span></div>
          <div className="stat"><strong>3</strong><span>Live AP Courses</span></div>
          <div className="stat"><strong>5 min</strong><span>Daily Sessions</span></div>
          <div className="stat"><strong>Free</strong><span>No Credit Card</span></div>
        </div>
      </div>
      <section>
        <div className="container">
          <p className="kicker">AP Courses</p>
          <h2>Choose your AP course and start today.</h2>
          <p className="sdesc">Each course is broken into unit pages, quizzes, and study guides so students can build understanding one concept at a time.</p>
          <div className="grid3">
            <a href="/ap-biology" className="ccard"><div className="ctop2"><div className="icon">🧬</div><span className="qcount">4,800 questions</span></div><h3>AP Biology</h3><p>Cells, genetics, evolution, ecology, and FRQ-style practice aligned to the AP exam.</p><span className="clink">Explore course →</span></a>
            <a href="/ap-human-geography" className="ccard"><div className="ctop2"><div className="icon">🌍</div><span className="qcount">4,200 questions</span></div><h3>AP Human Geography</h3><p>Population, culture, agriculture, cities, and political geography — Unit 1 through Unit 7.</p><span className="clink">Explore course →</span></a>
            <a href="/ap-computer-science-principles" className="ccard"><div className="ctop2"><div className="icon">💻</div><span className="qcount">3,000 questions</span></div><h3>AP Computer Science Principles</h3><p>Algorithms, data, internet, programming, and the societal impact of computing.</p><span className="clink">Explore course →</span></a>
          </div>
        </div>
      </section>
      <section id="faq">
        <div className="container">
          <p className="kicker">Student Questions</p>
          <h2>Questions students actually search for.</h2>
          <div className="faq-wrap" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map(({q,a},i)=>(
              <div key={i} className="fi" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <div className="fiq" tabIndex={0} role="button" aria-expanded="false"><span className="fiq-text" itemProp="name">{q}</span><span className="arr">▾</span></div>
                <div className="fia" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"><span itemProp="text">{a}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="nl-box">
            <div><h3>Get a free AP question every day.</h3><p>One question. One clear explanation. Daily practice that compounds over time.</p></div>
            <div>
              <div className="nl-form"><input type="email" placeholder="Your email address" aria-label="Email for daily AP question"/><button type="button">Join Free</button></div>
              <p className="nl-note">Free forever. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="cta-box">
            <div>
              <p className="kicker">Start Free</p>
              <h2>Give it 5 minutes a day.<br/>Let the progress compound.</h2>
              <p>Students don&apos;t need another overwhelming platform. They need a clean starting point and enough momentum to come back tomorrow.</p>
              <div className="cta-btns"><a href="/practice" className="btn btn-p">Try a free question →</a><a href="#faq" className="btn btn-s">Read AP exam FAQ</a></div>
            </div>
            <div className="cpoints">
              <div className="cp">✓ Start before signup friction appears</div>
              <div className="cp">✓ Explore courses, units, quizzes, and FAQs</div>
              <div className="cp">✓ Save progress when you care about it</div>
              <div className="cp">✓ Free forever — no credit card required</div>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/AP_Score_5_Logo.png" alt="APScore5" className="footer-logo"/>
              <p>AP practice questions, unit quizzes, and exam prep designed to help students build confidence one session at a time.</p>
              <p className="disc">AP® is a trademark of the College Board, which is not affiliated with APScore5.</p>
            </div>
            <div><h4>AP Courses</h4><a href="/ap-biology">AP Biology</a><a href="/ap-human-geography">AP Human Geography</a><a href="/ap-computer-science-principles">AP Computer Science Principles</a></div>
            <div><h4>Site</h4><a href="/courses">How it Works</a><a href="/practice">Practice Sets</a><a href="/pricing">Pricing</a><a href="/dashboard">Dashboard</a></div>
            <div><h4>Company</h4><a href="/about">About</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a><a href="/contact">Contact</a></div>
          </div>
        </div>
      </footer>
      <script dangerouslySetInnerHTML={{__html:`(function(){document.querySelectorAll('.fiq').forEach(function(b){b.addEventListener('click',function(){var o=b.classList.contains('open');document.querySelectorAll('.fiq').forEach(function(x){x.classList.remove('open');x.setAttribute('aria-expanded','false');});document.querySelectorAll('.fia').forEach(function(x){x.classList.remove('show');});if(!o){b.classList.add('open');b.setAttribute('aria-expanded','true');var n=b.nextElementSibling;if(n)n.classList.add('show');}});b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();b.click();}});});var done=false;document.querySelectorAll('#hero-opts .opt').forEach(function(o){o.addEventListener('click',function(){if(done)return;done=true;var ok=o.getAttribute('data-correct')==='true';document.querySelectorAll('#hero-opts .opt').forEach(function(x){x.style.pointerEvents='none';if(x.getAttribute('data-correct')==='true')x.classList.add('show-correct');});o.classList.add(ok?'chosen-correct':'chosen-wrong');document.getElementById('hero-feedback').classList.add('show');document.getElementById('hero-nudge').classList.add('show');document.getElementById('hero-next').classList.add('show');});});})();`}}/>
    </>
  );
}
"use client";

import { useEffect, useState } from "react";

const pages = ["Home", "About", "Services", "Donate", "News", "Contact", "Privacy"] as const;
type Page = (typeof pages)[number];

const photos = {
  hero: "/real-ambulances.png",
  ambulance: "/real-ambulances.png",
  monitor: "/zoll-monitor.jpg",
  aed: "/zoll-aed.jpg",
  chair: "/stair-chair.jpg",
  patch: "/hatzolah-patch.jpg",
};

function Photo({ src, label, className = "", temporary = false }: { src: string; label: string; className?: string; temporary?: boolean }) {
  return <figure className={`photo ${className}`}><img src={src} alt={label} />{temporary && <figcaption>Temporary photo reference · Replace with your organization’s {label.toLowerCase()}</figcaption>}</figure>;
}

export default function Site() {
  const [page, setPage] = useState<Page>("Home");
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const sync = () => { const p = location.hash.slice(1); if (pages.includes(p as Page)) setPage(p as Page); };
    sync(); addEventListener("hashchange", sync); return () => removeEventListener("hashchange", sync);
  }, []);
  const go = (p: Page) => { setPage(p); setMenu(false); location.hash = p; scrollTo({ top: 0, behavior: "smooth" }); };
  return <>
    <div className="emergency-bar"><span>IN A MEDICAL EMERGENCY</span><a href="tel:4504342222">CALL 450-434-2222</a><small>Available 24/7</small></div>
    <header>
      <button className="brand" onClick={() => go("Home")} aria-label="Hatzolah of Kiryas Tosh home"><img src="/logo.png" alt="Official Hatzolah of Kiryas Tosh seal" /><span><b>HATZOLAH</b><small>of Kiryas Tosh · Service Ambulancier Bénévole</small></span></button>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Open navigation">☰</button>
      <nav className={menu ? "open" : ""}>{pages.filter(p => p !== "Donate" && p !== "Privacy").map(p => <button className={page === p ? "active" : ""} onClick={() => go(p)} key={p}>{p}</button>)}<button className="donate" onClick={() => go("Donate")}>Donate now</button></nav>
    </header>
    <main>
      {page === "Home" && <Home go={go} />}
      {page === "About" && <About />}
      {page === "Services" && <Services />}
      {page === "Donate" && <Donate />}
      {page === "News" && <News />}
      {page === "Contact" && <Contact />}
      {page === "Privacy" && <Privacy />}
    </main>
    <footer><div className="footer-grid"><div className="footer-brand"><img src="/logo.png" alt="Official Hatzolah of Kiryas Tosh seal" /><div><b>Hatzolah of Kiryas Tosh</b><p>Volunteer emergency medical response, serving our community when every second counts.</p></div></div><div><h4>Contact</h4><a href="tel:4504342222">Emergency: 450-434-2222</a><a href="tel:4504356738">Office: 450-435-6738</a><a href="mailto:info@hatzolaht.com">info@hatzolaht.com</a><p><strong>Sauvetage Québec / Hatzolah Québec</strong><br/>3739 Rue de la Rivière-Cachée<br />Boisbriand, QC</p></div><div><h4>Explore</h4>{["About","Services","Donate","News","Privacy"].map(p=><button key={p} onClick={()=>go(p as Page)}>{p}</button>)}</div></div><div className="copyright">© 2026 Hatzolah of Kiryas Tosh. All rights reserved.</div></footer>
  </>;
}

function Eyebrow({children}:{children:React.ReactNode}) { return <div className="eyebrow">{children}</div>; }
function PageHero({kicker,title,text}:{kicker:string,title:string,text:string}) { return <section className="page-hero"><Eyebrow>{kicker}</Eyebrow><h1>{title}</h1><p>{text}</p></section>; }

function Home({go}:{go:(p:Page)=>void}) { return <>
  <section className="hero"><img src={photos.hero} alt="Hatzolah of Tosh ambulance" /><div className="shade"/><div className="hero-copy"><Eyebrow>Volunteer emergency medical response</Eyebrow><h1>Here when<br/><em>every second counts.</em></h1><p>Rapid, compassionate emergency care for our community—24 hours a day, 365 days a year.</p><div className="actions"><a className="primary" href="tel:4504342222">Call emergency line</a><button className="secondary" onClick={()=>go("Donate")}>Support our mission</button></div></div></section>
  <section className="stats"><div><b>24/7</b><span>Including Shabbos & Yom Tov</span></div><div><b>10</b><span>Volunteer responders</span></div><div><b>2</b><span>Ambulances plus response cars</span></div><div><b>Free</b><span>No charge for emergency service</span></div></section>
  <section className="split section"><div><Eyebrow>Our mission</Eyebrow><h2>Neighbors helping neighbors in their most critical moments.</h2><p>Hatzolah brings trained volunteer responders, essential medical equipment, and compassionate care directly to people facing an emergency. Our mission is simple: arrive quickly, help skillfully, and treat every person with dignity.</p><button className="text-link" onClick={()=>go("About")}>Learn about Hatzolah →</button></div><Photo src={photos.monitor} label="ZOLL emergency cardiac monitor" className="equipment-photo" /></section>
  <section className="dark section"><Eyebrow>What we do</Eyebrow><h2>Prepared for the moments that matter.</h2><div className="cards"><article><span>01</span><h3>Emergency response</h3><p>Trained volunteers respond rapidly with lifesaving equipment and care.</p></article><article><span>02</span><h3>Ambulance service</h3><p>Patient-focused transportation and coordinated pre-hospital support.</p></article><article><span>03</span><h3>Training & readiness</h3><p>Continuous education keeps responders prepared for complex emergencies.</p></article></div></section>
  <section className="cta"><Eyebrow>Powered by community</Eyebrow><h2>Your support helps save lives.</h2><p>Donations sustain medical equipment, ambulances, training, communications, and 24/7 readiness.</p><button className="primary" onClick={()=>go("Donate")}>Make a donation</button></section>
  </>; }

function About(){return <><PageHero kicker="Who we are" title="A tradition of care. A commitment to respond." text="Hatzolah of Tosh is a first responder agency staffed by 10 volunteers, with two ambulances and response cars."/><section className="split section history"><div className="history-image"><img src="/hatzolah-archive.png" alt="Historic Hatzolah of Tosh ambulances"/><small>From the Hatzolah of Tosh archive</small></div><div><Eyebrow>Our story</Eyebrow><h2>Serving Tosh since 1975.</h2><p>Hatzolah of Tosh was started by Rabbi Israel Lowen in 1975 and remains under his guidance today. The service was developed after a tragic electrocution took the life of a young man while emergency medical response was more than 30 minutes away.</p><p>Today, Hatzolah makes immediate intervention available when it is needed. The organization operates 24 hours a day, seven days a week—including Shabbos and Yom Tov—and never charges for its emergency services.</p></div></section><section className="split section team-section"><div><Eyebrow>Our volunteers</Eyebrow><h2>Local people, trained and ready.</h2><p>Ten dedicated volunteers staff the response agency, supported by ambulances, response cars, communications, medical supplies, and continuing education.</p></div><Photo src={photos.ambulance} label="two Hatzolah of Tosh ambulances ready for service"/></section><section className="values section"><Eyebrow>Our values</Eyebrow><div className="cards"><article><h3>Speed</h3><p>We organize for rapid response because minutes—and seconds—matter.</p></article><article><h3>Compassion</h3><p>Patients and families receive calm, dignified care in stressful moments.</p></article><article><h3>Service</h3><p>Emergency assistance is provided without charge to those who need it.</p></article></div></section></>}

function Services(){return <><PageHero kicker="Our services" title="Emergency care, readiness, and community support." text="A coordinated volunteer response system designed to deliver help quickly and professionally."/><section className="service-list section"><div><Photo src={photos.ambulance} label="Hatzolah of Tosh ambulances in service"/><h2>Emergency medical response</h2><p>Rapid on-scene assessment, stabilization, and support from trained volunteer responders carrying essential equipment.</p></div><div><Photo src={photos.chair} label="Ferno emergency stair chair" className="equipment-photo"/><h2>Training & preparedness</h2><p>Ongoing clinical education, simulations, and operational practice help keep the team ready around the clock.</p></div><div><Photo src={photos.aed} label="ZOLL automated external defibrillator" className="equipment-photo"/><h2>Equipment & communications</h2><p>Reliable dispatch, radios, response vehicles, medical bags, AEDs, and supplies support a fast, coordinated response.</p></div></section><section className="emergency-call"><h2>Need emergency help now?</h2><a href="tel:4504342222">450-434-2222</a><p>For urgent medical assistance, call immediately.</p></section></>}

function Donate(){
  const [country,setCountry]=useState<"Canada"|"United States">("Canada");
  return <><PageHero kicker="Donate" title="One gift can keep lifesaving help moving." text="Choose Canada or the United States, then select the easiest way to give."/><section className="giving section"><div className="giving-intro"><div><Eyebrow>Start here</Eyebrow><h2>Where are you donating?</h2></div><div className="country-tabs" role="tablist" aria-label="Donation country"><button role="tab" aria-selected={country==="Canada"} className={country==="Canada"?"selected":""} onClick={()=>setCountry("Canada")}><span aria-hidden="true">🇨🇦</span> Canada</button><button role="tab" aria-selected={country==="United States"} className={country==="United States"?"selected":""} onClick={()=>setCountry("United States")}><span aria-hidden="true">🇺🇸</span> United States</button></div></div>
  {country==="Canada"?<DonationMethods country="Canada"/>:<DonationMethods country="United States"/>}</section></>}

function DonationMethods({country}:{country:"Canada"|"United States"}){
  const canada=country==="Canada";
  const [method,setMethod]=useState<"card"|"etransfer"|"cheque"|"bank">("card");
  const activeMethod=!canada&&method==="etransfer"?"card":method;
  return <div className="donation-shell"><div className="method-tabs" role="tablist" aria-label="Donation method">
    <button className={activeMethod==="card"?"selected":""} onClick={()=>setMethod("card")}><b>Credit card</b><small>Secure online gift</small></button>
    {canada&&<button className={activeMethod==="etransfer"?"selected":""} onClick={()=>setMethod("etransfer")}><b>e-Transfer</b><small>Send from your bank</small></button>}
    <button className={activeMethod==="cheque"?"selected":""} onClick={()=>setMethod("cheque")}><b>Cheque</b><small>Mail your donation</small></button>
    <button className={activeMethod==="bank"?"selected":""} onClick={()=>setMethod("bank")}><b>Bank transfer</b><small>Direct deposit details</small></button>
  </div><div className="method-panel" role="tabpanel">
    {activeMethod==="card"&&<><Eyebrow>Credit card</Eyebrow><h2>Donate securely online</h2><p>{canada?"Your Canadian-dollar gift is processed securely through CanadaHelps.":"Your U.S.-dollar gift is processed through the secure online donation page."}</p><a className="primary" href={canada?"https://www.canadahelps.org/en/charities/sauvetage-quebec/":"https://hatzolaht.com/donate/"} target="_blank" rel="noreferrer">Continue to secure payment</a></>}
    {activeMethod==="etransfer"&&canada&&<><Eyebrow>Interac e-Transfer</Eyebrow><h2>Send directly from your bank</h2><p>Use this email as the recipient:</p><a className="method-value" href="mailto:hatzolahquebec@gmail.com">hatzolahquebec@gmail.com</a><p className="fine-print">For a charitable receipt, include your full name, mailing address, and email in the transfer message.</p></>}
    {activeMethod==="cheque"&&<><Eyebrow>Cheque</Eyebrow><h2>Make your cheque payable to</h2><b className="method-value">{canada?"Sauvetage Québec / Hatzolah Québec":"Hatzolah Tosh Inc."}</b><address>{canada?<>3739 chemin de la Rivière-Cachée<br/>Boisbriand, QC J7E 4H4<br/>Canada</>:<>240 Bates Drive<br/>Monsey, NY 10952<br/>United States</>}</address></>}
    {activeMethod==="bank"&&<><Eyebrow>Bank transfer</Eyebrow><h2>Direct deposit details</h2>{canada?<dl><div><dt>Bank</dt><dd>BMO</dd></div><div><dt>Account holder</dt><dd>Sauvetage Québec / Hatzolah Québec</dd></div><div><dt>Institution</dt><dd>001</dd></div><div><dt>Transit</dt><dd>27601</dd></div><div><dt>Account</dt><dd>1985-722</dd></div></dl>:<dl><div><dt>Bank</dt><dd>JPMorgan Chase Bank</dd></div><div><dt>Account holder</dt><dd>HATZOLAH TOSH INC</dd></div><div><dt>Routing</dt><dd>021000021</dd></div><div><dt>Account</dt><dd>919716923</dd></div></dl>}<p className="fine-print">Confirm the account-holder name before sending. Questions? <a href="mailto:info@hatzolaht.com">Email the office</a>.</p></>}
  </div><aside className="charity-strip"><img src={photos.patch} alt="Hatzolah Ambulancier Québec patch"/><div><b>{canada?"Sauvetage Québec / Hatzolah Québec":"Hatzolah Tosh Inc."}</b><span>{canada?"Canadian charity 707622403 RR 0001":"U.S. EIN 82-0639848 · 501(c)(3)"}</span></div><small>Tax benefits apply to the extent permitted by law.</small></aside></div>
}

function News(){return <><PageHero kicker="News & updates" title="Stories of service, readiness, and community." text="Follow how Hatzolah maintains readiness and serves the community."/><section className="news section"><article><Photo src={photos.monitor} label="ZOLL cardiac monitor" className="equipment-photo"/><span>Training</span><h2>Keeping skills sharp through continuous education</h2><p>Ongoing education and practice help our volunteers remain ready for demanding emergency calls.</p></article><article><Photo src={photos.ambulance} label="Hatzolah ambulances"/><span>Fleet</span><h2>Investing in reliable emergency response</h2><p>Reliable vehicles, communications, and medical equipment make rapid care possible.</p></article><article><Photo src={photos.chair} label="Ferno emergency stair chair" className="equipment-photo"/><span>Equipment</span><h2>The right tools for every environment</h2><p>Specialized equipment helps responders deliver safer, faster care wherever an emergency occurs.</p></article></section></>}

function Contact(){
  const [status,setStatus]=useState<"idle"|"sending"|"sent"|"error">("idle");
  const submit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setStatus("sending");
    const form=event.currentTarget;
    try{
      const response=await fetch("https://formsubmit.co/ajax/info@hatzolaht.com",{method:"POST",headers:{Accept:"application/json"},body:new FormData(form)});
      if(!response.ok) throw new Error("Unable to send");
      form.reset();
      setStatus("sent");
    }catch{setStatus("error");}
  };
  return <><PageHero kicker="Contact us" title="We’re here to help." text="Send a message to our office for donations, administration, or other non-emergency questions."/><section className="contact section"><div className="contact-cards"><article><span>Emergency line · 24/7</span><a href="tel:4504342222">450-434-2222</a><p>Call immediately for urgent medical assistance.</p></article><article><span>Office</span><a href="tel:4504356738">450-435-6738</a><p>For administration and general inquiries.</p></article><article><span>Address</span><h3>Sauvetage Québec / Hatzolah Québec<br/>3739 Rue de la Rivière-Cachée<br/>Boisbriand, QC J7E 4H4</h3><p>Office location; not a walk-in emergency department.</p></article></div><div className="form-preview"><Eyebrow>General inquiries</Eyebrow><h2>Send us a message</h2><p>Complete the form and your message will be delivered to our office email.</p>{status==="sent"?<div className="form-success" role="status"><b>Thank you. Your message was sent.</b><p>Someone from the Hatzolah office will respond as soon as possible.</p><button className="text-link" onClick={()=>setStatus("idle")}>Send another message</button></div>:<form className="contact-form" onSubmit={submit}><input type="hidden" name="_subject" value="New message from the Hatzolah of Kiryas Tosh website"/><input type="hidden" name="_template" value="table"/><input className="honey" type="text" name="_honey" tabIndex={-1} autoComplete="off"/><div className="form-row"><label>Full name<input name="name" type="text" autoComplete="name" required/></label><label>Email address<input name="email" type="email" autoComplete="email" required/></label></div><div className="form-row"><label>Phone number<input name="phone" type="tel" autoComplete="tel"/></label><label>Subject<select name="subject" defaultValue="General inquiry" required><option>General inquiry</option><option>Donation question</option><option>Volunteer information</option><option>Community event</option><option>Other</option></select></label></div><label>Message<textarea name="message" required minLength={10}/></label><button className="primary" type="submit" disabled={status==="sending"}>{status==="sending"?"Sending…":"Send message"}</button>{status==="error"&&<p className="form-error" role="alert">The message could not be sent. Please try again or call the office at <a href="tel:4504356738">450-435-6738</a>.</p>}<small>Do not include private medical information. Form messages are securely forwarded to our office email.</small></form>}<div className="safe"><b>Medical emergency?</b><p>Do not use this form. Call <a href="tel:4504342222">450-434-2222</a> immediately.</p></div></div></section></>
}

function Privacy(){return <><PageHero kicker="Privacy" title="Respecting the trust of our community." text="How Hatzolah Tosh Inc. handles information provided through its website and donation process."/><section className="legal section"><h2>Privacy notice</h2><p>This website does not accept payments directly, create user accounts, or intentionally collect personal health information. Contact-form messages are forwarded to the Hatzolah office through a form-delivery provider.</p><h3>Information and its use</h3><p>Hatzolah may collect contact and billing details needed to process donations, maintain donor records, issue confirmations or tax receipts where applicable, respond to inquiries, improve the donor experience, and meet legal obligations.</p><h3>Sharing and security</h3><p>Contact and donor information is not shared for third-party marketing. Information may be provided to trusted service providers supporting message delivery, payment, or website operations, or where legally required. Appropriate security measures will be used, although no online transmission is completely risk-free.</p><h3>Medical emergencies</h3><p>Emergency services are provided at no cost. Do not send medical details through the contact form; call <a href="tel:4504342222">450-434-2222</a> for urgent assistance.</p><h3>Questions</h3><p>Email <a href="mailto:info@hatzolaht.com">info@hatzolaht.com</a> or call <a href="tel:4504356738">450-435-6738</a>.</p></section></>}

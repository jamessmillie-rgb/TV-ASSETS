(function(){
const SYS={
 heart:{n:"Heart and circulation",mk:[["ApoB","the count of particles that actually cause heart disease"],["Lp(a)","genetic risk, tested once for life"],["hs-CRP","low-grade inflammation in the artery wall"],["Homocysteine","vascular risk, and a functional B12 and folate check",'sig'],["HbA1c","sugar control feeding cardiac risk"]]},
 metabolic:{n:"Blood sugar and metabolism",mk:[["Fasting insulin","the earliest sign of insulin resistance, years before HbA1c moves"],["HOMA-IR","how resistant you are, as a number"],["HbA1c","your three-month sugar average"],["Triglycerides","the fat that rises first when carbs exceed need"],["Adiponectin","the fat-cell hormone that falls before insulin resistance shows",'sig']]},
 thyroid:{n:"Thyroid",mk:[["TSH","the pituitary's demand signal"],["Free T3","the active hormone that sets your metabolic rate"],["Free T4","the storage hormone T3 is made from"],["TPO antibodies","the Hashimoto's screen"]]},
 hormones:{n:"Sex hormones",mk:[["Testosterone","drive, energy and body composition"],["SHBG","how much of it is actually free to act"],["Oestradiol","balance with testosterone shapes mood and fat storage"],["LH and FSH","whether the signal from the brain is the problem"],["Cortisol","chronic stress suppresses the whole axis"]]},
 nutrients:{n:"Iron and nutrients",mk:[["Ferritin","iron stores, the commonest deficiency in the UK"],["Transferrin saturation","how loaded your iron transport is"],["Vitamin B12","nerve function and energy"],["Active B12","the fraction your cells can use",'sig'],["Folate","cell repair"],["Vitamin D","immunity, mood and bone"],["Magnesium","sleep, muscle and glucose"]]},
 liver:{n:"Liver",mk:[["ALT","liver cell stress"],["GGT","the marker most sensitive to alcohol and fatty liver"],["AST","liver and muscle"],["Bilirubin","bile flow"]]},
 kidneys:{n:"Kidneys",mk:[["Cystatin C","kidney filtration without the muscle-mass error"],["eGFR","filtration rate"],["Creatinine","the standard marker"],["Uric acid","gout and metabolic stress"]]},
 gut:{n:"Digestion",mk:[["Anti-tTG","coeliac screen"],["H. pylori","the stomach infection behind bloating and ulcers"],["Ferritin and B12","the first to fall when absorption fails"],["Gastrin","stomach acid production",'sig']]},
 immune:{n:"Immune and inflammation",mk:[["hs-CRP","body-wide inflammation"],["White cell differential","your immune army by type"],["Rheumatoid factor","autoimmune joint screen"],["Anti-CCP","the specific rheumatoid arthritis marker, years before damage",'sig'],["ANA","the lupus and autoimmune screen",'sig']]},
 brain:{n:"Brain, mood and sleep",mk:[["Vitamin B12","nerve function and clarity"],["Free T3","the brain is the most thyroid-sensitive organ"],["Cortisol","the stress and sleep hormone"],["Ferritin","oxygen delivery to the brain"],["Vitamin D","low levels track with low mood"]]},
 lungs:{n:"Lungs and oxygen",mk:[["Haemoglobin","oxygen carrying capacity"],["hs-CRP","airway inflammation"],["White cells","infection and smoking response"]]},
 bone:{n:"Bones and joints",mk:[["Vitamin D","calcium absorption"],["Calcium and PTH","bone balance"],["ALP","bone turnover"],["Uric acid","gout"],["DKK-1","bone formation, rarely available",'sig']]}
};
const CNT={heart:9,metabolic:8,thyroid:5,hormones:9,nutrients:11,liver:8,kidneys:6,gut:7,immune:10,brain:8,lungs:6,bone:6};
const LVL=[["No signals","#2ce4ad"],["Worth checking","#f59e0b"],["Needs attention","#f97316"],["Priority","#ef4444"]];
function age(dob){if(!dob)return null;const d=new Date(dob),t=new Date();let a=t.getFullYear()-d.getFullYear();const m=t.getMonth()-d.getMonth();if(m<0||(m===0&&t.getDate()<d.getDate()))a--;return a}
function score(q){
  const s={},why={};for(const k in SYS){s[k]=0;why[k]=[]}
  const add=(k,pts,reason)=>{s[k]+=pts;why[k].push(reason)};
  const has=(key,v)=>(q[key]||'').split(', ').includes(v);
  const sym=v=>has('symptoms',v),cond=v=>has('conditions',v),med=v=>has('medications',v),hab=v=>has('habits',v),fam=v=>has('familyHistory',v),goal=v=>has('goals',v);
  const a=age(q.dob)||35, female=q.gender==='Female', male=q.gender==='Male';
  const bmi=q.height&&q.weight?q.weight/((q.height/100)**2):null;
  const dur=q.symptomDuration||'';const longsym=/year|Always/.test(dur);
  // legacy (v1) answers: map the old 1 to 10 diet rating
  if(!q.quiz_version){const dr=parseInt(q.dietRating||'5');if(dr<=3){add('metabolic',2,'a low diet-quality rating');add('nutrients',1,'a low diet-quality rating')}const dc=parseInt(q.dietConsistency||'5');if(dc<=3){add('thyroid',1,'eating very little');add('nutrients',1,'eating very little')}}
  // symptoms
  if(sym('Low Energy/Fatigue')){add('nutrients',3,'fatigue'+(longsym?' for over a year':''));add('thyroid',2,'fatigue');add('brain',1,'fatigue')}
  if(sym('Brain Fog')){add('brain',3,'brain fog');add('thyroid',1,'brain fog');add('nutrients',1,'brain fog')}
  if(sym('Low Mood/Anxiety')){add('brain',3,'low mood or anxiety');add('thyroid',1,'low mood')}
  if(sym('Poor Sleep/Insomnia')){add('brain',2,'poor sleep');add('hormones',1,'poor sleep')}
  if(sym('Bloating or Digestive Discomfort')){add('gut',4,'bloating');add('nutrients',1,'bloating')}
  if(sym('Weight Gain / Difficulty Losing Weight')){add('metabolic',3,'difficulty losing weight');add('thyroid',2,'weight gain')}
  if(sym('Low Sex Drive/Libido')){add('hormones',3,'low libido');add('brain',1,'low libido')}
  if(sym('Poor Exercise Recovery')){add('nutrients',2,'poor recovery');add('hormones',2,'poor recovery');add('immune',1,'poor recovery')}
  if(sym('Frequent Illness')){add('immune',3,'frequent illness');add('nutrients',1,'frequent illness')}
  if(sym('Hair Thinning/Hair Loss')){add('nutrients',2,'hair thinning');add('thyroid',2,'hair thinning');add('hormones',1,'hair thinning')}
  if(sym('Skin Breakouts')){add('hormones',2,'skin breakouts');add('metabolic',1,'skin breakouts')}
  if(sym('Joint Pain/Stiffness')){add('immune',3,'joint pain');add('bone',2,'joint pain')}
  if(sym('Irregular Periods')){add('hormones',3,'irregular periods');add('thyroid',1,'irregular periods');add('metabolic',1,'irregular periods')}
  if(sym('Palpitations or dizziness')){add('heart',2,'palpitations');add('nutrients',2,'dizziness');add('thyroid',1,'palpitations')}
  if(sym('Feeling cold, or cold hands and feet')){add('thyroid',3,'feeling cold');add('nutrients',2,'cold hands and feet')}
  if(sym('Headaches')){add('brain',2,'headaches');add('nutrients',1,'headaches')}
  // conditions
  if(cond('Type 2 Diabetes')||cond('Type 1 Diabetes')||cond('Prediabetes')){add('metabolic',5,'diagnosed diabetes or prediabetes');add('kidneys',2,'diabetes');add('heart',2,'diabetes')}
  if(cond("Polycystic Ovary Syndrome (PCOS)")){add('hormones',4,'PCOS');add('metabolic',3,'PCOS')}
  if(cond("Hypothyroidism (e.g. Hashimoto's)")||cond("Hyperthyroidism (e.g. Graves' Disease)"))add('thyroid',5,'a diagnosed thyroid condition');
  if(cond('Rheumatoid Arthritis')||cond('Systemic Lupus Erythematosus (SLE)')||cond('Psoriasis')){add('immune',5,'a diagnosed autoimmune condition');add('bone',1,'autoimmune')}
  if(cond('Coeliac Disease')||cond("Crohn's Disease")||cond('Ulcerative Colitis')||cond('IBS')){add('gut',5,'a diagnosed gut condition');add('nutrients',3,'a gut condition that affects absorption')}
  if(cond('Non-Alcoholic Fatty Liver Disease (NAFLD)')){add('liver',5,'NAFLD');add('metabolic',3,'NAFLD')}
  if(cond('Chronic Kidney Disease (CKD)'))add('kidneys',5,'CKD');
  if(cond('Hypertension (High Blood Pressure)')||cond('High cholesterol')||cond('Coronary Artery Disease / Ischemic Heart Disease')){add('heart',5,'a diagnosed cardiovascular condition');add('kidneys',1,'blood pressure')}
  if(cond('Anaemia'))add('nutrients',4,'anaemia');
  if(cond('Osteoporosis or osteopenia'))add('bone',5,'osteoporosis');
  if(cond('Gout')){add('bone',3,'gout');add('kidneys',2,'gout')}
  if(cond('Asthma'))add('lungs',3,'asthma');
  if(cond('Chronic Fatigue Syndrome (ME/CFS)')||cond('Long COVID / Post-Viral Syndrome')){add('immune',3,'post-viral fatigue');add('nutrients',2,'post-viral fatigue');add('brain',2,'post-viral fatigue')}
  if(cond('Major Depressive Disorder')||cond('Anxiety disorder'))add('brain',3,'a diagnosed mood condition');
  if(cond('Sleep apnoea')){add('heart',2,'sleep apnoea');add('metabolic',2,'sleep apnoea')}
  // medications
  if(med('Statins'))add('liver',1,'statins');
  if(med('Metformin'))add('nutrients',2,'metformin, which lowers B12');
  if(med('Levothyroxine'))add('thyroid',2,'levothyroxine');
  if(med('Oral Contraceptives (Combined Pill)')||has('hormonalMeds','Combined pill'))add('hormones',1,'the combined pill');
  if(med('HRT (Hormone Replacement Therapy)')||has('hormonalMeds','HRT'))add('hormones',2,'HRT');
  if(med('Testosterone Replacement Therapy (TRT)')){add('hormones',3,'TRT');add('heart',2,'TRT and haematocrit');add('liver',1,'TRT')}
  if(med('Mounjaro, Wegovy or Ozempic (GLP-1)')){add('nutrients',2,'a GLP-1 medication');add('metabolic',2,'a GLP-1 medication');add('liver',1,'GLP-1')}
  if(med('Proton Pump Inhibitors (PPIs, e.g. Omeprazole)')){add('nutrients',3,'a PPI, which blocks B12 and iron absorption');add('gut',1,'PPI')}
  if(med('Corticosteroids (e.g. Prednisolone)')){add('metabolic',2,'steroids');add('bone',2,'steroids')}
  if(med('SSRIs (e.g. Sertraline, Fluoxetine)')||med('SNRIs (e.g. Venlafaxine, Duloxetine)'))add('brain',1,'an antidepressant');
  if(med('Diuretics (e.g. Furosemide, Bendroflumethiazide)'))add('kidneys',2,'a diuretic');
  if(med('ACE Inhibitors (e.g. Ramipril)')||med('ARBs (e.g. Losartan)')){add('kidneys',2,'blood pressure medication');add('heart',1,'blood pressure medication')}
  if(med('Insulin'))add('metabolic',3,'insulin');
  if(med('Finasteride'))add('hormones',2,'finasteride');
  if(med('Allopurinol'))add('kidneys',1,'allopurinol');
  if(med('Biologics or immunosuppressants'))add('immune',3,'immunosuppressants');
  // family
  if(fam('Heart attack or stroke before 60'))add('heart',4,'early heart disease in the family');
  if(fam('Type 2 diabetes'))add('metabolic',3,'type 2 diabetes in the family');
  if(fam('Thyroid disease'))add('thyroid',3,'thyroid disease in the family');
  if(fam('An autoimmune condition'))add('immune',3,'autoimmune disease in the family');
  if(fam('Bowel, breast, prostate or ovarian cancer')){add('gut',1,'cancer in the family');add('immune',1,'cancer in the family')}
  if(fam('Osteoporosis'))add('bone',3,'osteoporosis in the family');
  if(fam('Dementia'))add('brain',2,'dementia in the family');
  // lifestyle
  if(hab('Smoking tobacco')){add('lungs',4,'smoking');add('heart',2,'smoking');add('immune',1,'smoking')}
  if(hab('Vaping nicotine'))add('lungs',2,'vaping');
  const alc=q.alcoholWeekly||'';
  if(alc==='15 or more'){add('liver',4,'15+ drinks a week');add('nutrients',1,'alcohol')}else if(alc==='10 to 14')add('liver',3,'10 to 14 drinks a week');else if(alc==='5 to 9')add('liver',1,'5 to 9 drinks a week');
  if(hab('Frequent painkiller use (e.g. ibuprofen, paracetamol)')){add('kidneys',2,'regular painkillers');add('liver',2,'regular painkillers')}
  if(hab('Anabolic steroids or PEDs (e.g. testosterone, SARMs)')){add('liver',3,'PED use');add('hormones',3,'PED use');add('heart',3,'PED use')}
  if(hab('Recreational drug use (e.g. cocaine, MDMA)')){add('heart',2,'recreational drugs');add('liver',1,'recreational drugs')}
  if(hab('Sleep restriction (less than 6 hours most nights)')){add('brain',2,'under 6 hours sleep');add('metabolic',1,'short sleep')}
  if(hab('Night shifts or rotating shifts')){add('brain',2,'shift work');add('metabolic',1,'shift work')}
  if(hab('Overuse of caffeine or energy drinks'))add('brain',1,'heavy caffeine');
  const sl=q.sleepHours||'';if(sl==='Under 6'){add('brain',2,'under 6 hours sleep');add('metabolic',1,'short sleep')}
  if(q.sleepQuality==='Exhausted or waking in the night'){add('brain',2,'waking exhausted');add('hormones',1,'night waking')}
  if(q.stressLevel==='Constantly'){add('hormones',2,'constant stress');add('brain',2,'constant stress')}else if(q.stressLevel==='Most days'){add('hormones',1,'stress most days');add('brain',1,'stress most days')}
  if(q.energyPattern==='Afternoon crash')add('metabolic',2,'afternoon crashes');
  if(q.energyPattern==='Wired at night')add('hormones',2,'a reversed cortisol pattern');
  if(q.energyPattern==='Tired on waking')add('brain',1,'tired on waking');
  if(q.energyPattern==='Low all day'){add('nutrients',2,'low energy all day');add('thyroid',1,'low energy all day')}
  const upf=q.upfFrequency||'';if(upf==='Daily'){add('metabolic',3,'ultra-processed food every day');add('heart',1,'diet')}else if(upf==='Most days')add('metabolic',2,'ultra-processed food most days');
  const sug=q.sugarFrequency||'';if(sug==='Several a day')add('metabolic',3,'sugar several times a day');else if(sug==='Daily')add('metabolic',2,'daily sugar');
  if(q.vegPortions==='0 to 1'){add('nutrients',2,'almost no veg or fruit');add('gut',1,'low fibre')}
  if(['Vegan (fully plant-based)','Vegetarian (includes eggs and dairy)'].includes(q.dietType||''))add('nutrients',3,'a plant-based diet');
  if(['Keto / Very Low-Carb','Carnivore (mostly or exclusively animal products)'].includes(q.dietType||'')){add('heart',2,'a very low-carb diet');add('thyroid',1,'very low carb')}
  if(q.appetite==='Small, or I often skip meals'){add('thyroid',2,'skipped meals');add('hormones',1,'undereating');add('nutrients',1,'undereating')}
  const st=q.steps||'';if(st==='<2,000'){add('metabolic',2,'very low daily movement');add('heart',1,'inactivity')}
  if(q.cardioDays==='0')add('heart',1,'no cardio');
  if(q.resistanceDays==='0'&&a>=45)add('bone',2,'no strength training after 45');
  if(['Hard','Very hard'].includes(q.trainingIntensity||'')){add('nutrients',2,'hard training');add('hormones',1,'hard training')}
  if(q.previousTest==='Yes, something was flagged')for(const k in s)s[k]+=0.5;
  // demographics
  if(bmi&&bmi>=30){add('metabolic',3,'a BMI over 30');add('liver',2,'BMI');add('heart',1,'BMI')}else if(bmi&&bmi>=27)add('metabolic',1,'a BMI over 27');
  if(bmi&&bmi<18.5)add('nutrients',2,'a low BMI');
  if(a>=50){add('heart',2,'being over 50');add('bone',2,'being over 50');add('metabolic',1,'age')}else if(a>=40){add('heart',1,'being over 40')}
  if(male&&a>=45)add('hormones',1,'age');
  if(female){if(q.cycle==='Heavy or painful'){add('nutrients',3,'heavy periods');add('hormones',1,'heavy periods')}if(q.cycle==='Irregular'){add('hormones',3,'irregular periods');add('thyroid',1,'irregular periods')}if(q.cycle==='Stopped (perimenopause or menopause)'){add('hormones',3,'perimenopause or menopause');add('bone',3,'menopause');add('heart',2,'menopause')}if(has('hormonalMeds','Trying to conceive'))add('hormones',2,'trying to conceive');if(a>=40&&a<55)add('hormones',1,'age')}
  if(['South Asian (e.g. Indian, Pakistani, Bangladeshi)','Black / African / Caribbean'].includes(q.ethnicity||'')){add('metabolic',1,'ancestry');add('nutrients',1,'vitamin D risk by ancestry')}
  // goals (light touch)
  if(goal('Prevent Disease')||goal('Improve Long-Term Health/Longevity')){add('heart',1,'a prevention goal');add('metabolic',1,'a prevention goal')}
  if(goal('Balance Hormones'))add('hormones',1,'a hormone goal');if(goal('Build Muscle'))add('hormones',1,'a muscle goal');if(goal('Lose Body Fat'))add('metabolic',1,'a fat-loss goal');if(goal('Improve Digestion and Gut Health'))add('gut',1,'a gut goal');if(goal('Boost Immune System'))add('immune',1,'an immunity goal');if(goal('Improve Sleep Quality')||goal('Reduce Stress and Anxiety'))add('brain',1,'a sleep or stress goal');
  const lvl={};for(const k in s){const v=s[k];lvl[k]=v>=7?3:v>=4?2:v>=2?1:0}
  return {s,lvl,why,a,bmi,female,male};
}
function sysWhy(k,r,q){
  const w=[...new Set(r.why[k])];if(!w.length)return "Nothing in your answers points here. It's still tested in full, because problems in one system show up in another.";
  const top=w.slice(0,4);const list=top.length>1?top.slice(0,-1).join(', ')+' and '+top[top.length-1]:top[0];
  return '<b>Because of '+list+'.</b> These are read as a set, never one at a time. '+({heart:"These decide whether your risk is genetic, dietary or inflammatory, which changes what to do about it.",metabolic:"Insulin resistance runs for a decade before HbA1c moves. Fasting insulin catches it while it's reversible.",thyroid:"TSH alone misses conversion problems and early autoimmune thyroid disease.",hormones:"A single testosterone or oestradiol value means little without SHBG and cortisol beside it.",nutrients:"A ferritin that is 'in range' can still be too low to feel well. Your report uses ideal ranges, not lab ranges.",liver:"GGT and ALT move long before anything is felt, and they respond fast to change.",kidneys:"Cystatin C avoids the error that muscle mass and diet introduce into creatinine.",gut:"Coeliac disease, H. pylori and malabsorption all leave fingerprints in blood before any gut test.",immune:"Distinguishing everyday inflammation from early autoimmune disease is the whole point of testing these together.",brain:"Mood, fog and sleep have measurable causes in thyroid, B12, cortisol and iron that are often missed.",lungs:"Oxygen carriage and inflammation both track smoking and airway stress.",bone:"Bone loss is silent. Vitamin D, calcium balance and turnover markers are the early warning."})[k];
}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
const ANCH={brain:[180,46,'R'],thyroid:[180,110,'L'],nutrients:[180,140,'R'],immune:[132,146,'L'],lungs:[134,204,'L'],heart:[192,200,'R'],liver:[150,270,'L'],metabolic:[216,278,'R'],kidneys:[222,322,'R'],gut:[180,352,'L'],hormones:[180,410,'R'],bone:[140,396,'L']};
function renderResults(q){
  const r=score(q);const keys=Object.keys(SYS).sort((a,b)=>r.lvl[b]-r.lvl[a]||r.s[b]-r.s[a]);
  const prio=keys.filter(k=>r.lvl[k]>=2),worth=keys.filter(k=>r.lvl[k]===1),fl=keys.filter(k=>r.lvl[k]>=1);
  const first=q['first-name']||'';
  document.getElementById('rtitle').innerHTML=prio.length?(prio.length+' '+(prio.length===1?'system needs':'systems need')+' a proper look.<br><em>'+worth.length+' more worth checking.</em>'):('Nothing urgent in your answers.<br><em>'+worth.length+' '+(worth.length===1?'area is':'areas are')+' worth checking.</em>');
  const legacy=!q.quiz_version;document.getElementById('legacy').style.display=legacy?'':'none';
  document.getElementById('rsub').textContent='Built from your answers only. Your blood will confirm, overturn or add to it, and every one of the 12 systems below is tested in full whatever colour it is here.';
  const pf=[];if(r.a)pf.push(['Age',r.a]);if(q.gender&&q.gender!=='Prefer not to say')pf.push(['Sex',q.gender]);if(r.bmi)pf.push(['BMI',r.bmi.toFixed(1)]);if(q.steps)pf.push(['Steps',q.steps]);if(q.sleepHours)pf.push(['Sleep',q.sleepHours+' h']);if(q.alcoholWeekly)pf.push(['Alcohol',q.alcoholWeekly+' a week']);
  document.getElementById('profile').innerHTML=pf.map(c=>'<span>'+c[0]+'<b>'+c[1]+'</b></span>').join('');
  // organs
  document.querySelectorAll('#figure .organ').forEach(g=>{const k=g.dataset.sys,l=r.lvl[k],c=LVL[l][1];
    g.setAttribute('stroke',c);g.setAttribute('fill',c);g.setAttribute('stroke-width','1.4');g.setAttribute('fill-opacity',l>=2?'.55':l===1?'.35':'.12');g.setAttribute('stroke-opacity',l>=1?'1':'.55');
    if(l>=2)g.setAttribute('filter','url(#glow)');else g.removeAttribute('filter');
    g.style.cursor='pointer';g.onclick=()=>openIdx(k);
  });
  // labels with leader lines (desktop only, via CSS on #labels)
  const L=[],R=[];fl.forEach(k=>{const a=ANCH[k];(a[2]==='L'?L:R).push(k)});
  const place=(arr,side)=>{arr.sort((x,y)=>ANCH[x][1]-ANCH[y][1]);let y=52;const out=[];arr.forEach(k=>{const ay=ANCH[k][1];y=Math.max(y,ay-2);out.push([k,y]);y+=62});return out};
  const lab=[];place(L,'L').forEach(([k,y])=>lab.push([k,y,'L']));place(R,'R').forEach(([k,y])=>lab.push([k,y,'R']));
  const num={};keys.forEach((k,i)=>num[k]=String(i+1).padStart(2,'0'));
  document.getElementById('labels').innerHTML=lab.map(([k,y,side])=>{const a=ANCH[k];const ax=a[0]+240,ay=a[1];const c=LVL[r.lvl[k]][1];const x=side==='L'?212:556;const tx=side==='L'?202:566;const anchor=side==='L'?'end':'start';
    return '<g class="lbl" data-sys="'+k+'" onclick="openIdx(\''+k+'\')"><path d="M'+ax+' '+ay+' L'+(side==='L'?ax-22:ax+22)+' '+y+' L'+x+' '+y+'" fill="none" stroke="'+c+'" stroke-width="1" stroke-opacity=".8"/><circle cx="'+ax+'" cy="'+ay+'" r="3" fill="'+c+'"/><text x="'+tx+'" y="'+(y-5)+'" text-anchor="'+anchor+'">'+SYS[k].n+'</text><text class="num" x="'+(side==='L'?tx:tx)+'" y="'+(y-24)+'" text-anchor="'+anchor+'">'+num[k]+'</text><text class="lv" x="'+tx+'" y="'+(y+12)+'" text-anchor="'+anchor+'" fill="'+c+'">'+LVL[r.lvl[k]][0]+'</text></g>'}).join('');
  // index
  document.getElementById('idx').innerHTML=keys.map((k,i)=>{const c=LVL[r.lvl[k]][1];return '<li data-sys="'+k+'"><div class="idx-h" onclick="this.parentElement.classList.toggle(\'open\')"><span class="idx-n">'+num[k]+'</span><span class="idx-t">'+SYS[k].n+'</span><span class="idx-l" style="color:'+c+'">'+LVL[r.lvl[k]][0]+'</span><svg class="idx-a" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></div><div class="idx-b"><div class="why">'+sysWhy(k,r,q)+'</div>'+SYS[k].mk.slice(0,3).map(m=>'<div class="mkrow"><b>'+m[0]+(m[2]?'<span class="sg">SIGNATURE</span>':'')+'</b><span>'+cap(m[1])+'.</span></div>').join('')+'<div class="mkmore">Plus '+(CNT[k]-3)+' more in this system, read alongside these.</div></div></li>'}).join('');
  // questions
  const QS={heart:"Is your cardiovascular risk genetic, dietary or inflammatory?",metabolic:"Is insulin resistance already under way, before HbA1c shows it?",thyroid:"Is your thyroid converting, and is it autoimmune?",hormones:"Are your hormones low, or just bound up and not free to act?",nutrients:"Are your iron and B12 actually adequate, or only 'in range'?",liver:"How much has alcohol or diet already changed your liver?",kidneys:"Are your kidneys filtering as well as your creatinine claims?",gut:"Is there a hidden absorption or inflammation problem behind your gut symptoms?",immune:"Is this ordinary inflammation or the start of something autoimmune?",brain:"Which of thyroid, B12, cortisol or iron is behind how you feel?",lungs:"Is smoking or airway stress showing in your blood yet?",bone:"Is bone loss already starting, silently?"};
  document.getElementById('qlead').textContent=fl.length?'Your answers raise '+fl.length+' questions. None has a single-marker answer.':'Your answers raise no specific questions, which is exactly when a full baseline earns its keep.';
  document.getElementById('qlist').innerHTML=fl.map(k=>{const c=LVL[r.lvl[k]][1];const sig=SYS[k].mk.some(m=>m[2]);return '<li><div><div class="qt">'+QS[k]+'</div><div class="qs"><i style="background:'+c+'"></i>'+SYS[k].n+' · '+CNT[k]+' markers read together'+(sig?' · full set on Signature':'')+'</div></div></li>'}).join('');
  document.getElementById('whole').textContent='These questions cover '+fl.length+' of the 12 systems your panel reads. The other '+(12-fl.length)+' are tested just as fully, because the surprises tend to come from where nobody was looking.';
  // silent
  const SIL=[["Lp(a)","Genetic. One in five carry a high level and feel nothing until an event. Tested once for life."],["ApoB","The particle count behind heart disease. Can be high with textbook cholesterol and no symptoms."],["Fasting insulin","Rises a decade before blood sugar does. There is no symptom for it."],["Cystatin C","Kidney decline is silent until most function is gone, and creatinine misreads in fit or slim people."],["Thyroid antibodies","Autoimmune thyroid disease starts years before TSH moves or you feel anything."],["hs-CRP","Low-grade inflammation with no symptoms is the common thread in heart disease, diabetes and ageing."],["Tumour markers","PSA, CA 125, CEA and others. Screening support, not diagnosis, and invisible without a test."],["PhenoAge","Your biological age from nine markers. Nothing you answered today can estimate it."]];
  document.getElementById('silent').innerHTML=SIL.map(m=>'<div><b>'+m[0]+'</b><p>'+m[1]+'</p></div>').join('');
  // recommendation: Ultimate essential, Signature extra mile
  const ultWhy=[];if(prio.length)ultWhy.push(prio.slice(0,3).map(k=>SYS[k].n.toLowerCase()).join(', ')+' need the full picture, not a spot check');ultWhy.push('PhenoAge, TrueScore and a clinician-reviewed written report');ultWhy.push('Ideal ranges set for your sex, age and answers');ultWhy.push('No findings, no fee');
  const sigWhy=[];if(r.lvl.immune>=1)sigWhy.push('Anti-CCP, ANA and complement, to settle whether inflammation is autoimmune');if(r.lvl.heart>=1||(q.familyHistory||'').includes('Heart'))sigWhy.push('Homocysteine, small dense LDL and cardiac injury markers');if((q.familyHistory||'').includes('cancer'))sigWhy.push('Four extra tumour markers given your family history');if(r.lvl.gut>=1)sigWhy.push('Gastrin and H. pylori for the gut');if(r.lvl.nutrients>=1)sigWhy.push('Active B12, red cell folate, zinc and copper');if(r.lvl.metabolic>=1)sigWhy.push('Adiponectin and fructosamine, earlier than insulin');if(r.a>=50)sigWhy.push('Physical measurements read with your bloods, at an age where silent risk accelerates');if(!sigWhy.length)sigWhy.push('90 specialist markers a consultant would order, in one appointment');
  document.getElementById('recoLead').textContent='Ultimate is essential in your case. If the budget allows, Signature goes the extra mile.';
  document.getElementById('reco').innerHTML='<div class="rc main"><div class="tagline">Essential in your case</div><h3>Ultimate Panel</h3><div class="price">£349<small>+ £19 clinic or £39 home draw</small></div><p>140 biomarkers, 100+ partner clinics or at home, report in 4 working days.</p><ul>'+ultWhy.map(x=>'<li>'+cap(x)+'</li>').join('')+'</ul><a href="/ultimate-panel" class="btn teal" style="width:100%">Book Ultimate</a></div>'+
   '<div class="rc sig"><div class="tagline">The extra mile</div><h3>Signature Panel</h3><div class="price">£799<small>clinic appointment included</small></div><p>Everything in Ultimate plus 90 specialist markers by Randox Health, and physical measurements.</p><ul>'+sigWhy.slice(0,3).map(x=>'<li>'+x+'</li>').join('')+'</ul><a href="/signature-panel" class="btn gold" style="width:100%">Book Signature</a></div>';
  // lifestyle
  const life=[];const Lf=(lab,val,lv,note)=>life.push({lab,val,lv,note});
  if(q.dietType)Lf('Diet',q.dietType,['Vegan (fully plant-based)','Vegetarian (includes eggs and dairy)'].includes(q.dietType)?1:['Ultra-Processed / Fast Food Heavy','Takeaway / Convenience-Based Eating'].includes(q.dietType)?2:0,['Vegan (fully plant-based)','Vegetarian (includes eggs and dairy)'].includes(q.dietType)?'B12, iron, zinc and omega-3 are read against plant-based targets, not the general population.':['Ultra-Processed / Fast Food Heavy','Takeaway / Convenience-Based Eating'].includes(q.dietType)?'Insulin, triglycerides and GGT are read as diet-sensitive and given concrete food targets.':'A balanced pattern. Your report looks for gaps rather than assuming them.');
  if(q.upfFrequency)Lf('Processed food',q.upfFrequency,q.upfFrequency==='Daily'?2:q.upfFrequency==='Most days'?1:0,'Drives fasting insulin and triglycerides before anything else. Both are on your panel.');
  if(q.alcoholWeekly)Lf('Alcohol',q.alcoholWeekly+' a week',q.alcoholWeekly==='15 or more'?3:q.alcoholWeekly==='10 to 14'?2:q.alcoholWeekly==='5 to 9'?1:0,'GGT is the first marker to move and the first to recover. Your report sets a target, not a lecture.');
  if(q.sleepHours)Lf('Sleep',q.sleepHours+' hours, '+(q.sleepQuality||'').toLowerCase(),q.sleepHours==='Under 6'?2:q.sleepQuality==='Exhausted or waking in the night'?1:0,'Short or broken sleep raises cortisol and glucose the next morning. Both are read with that in mind.');
  if(q.stressLevel)Lf('Stress',q.stressLevel,q.stressLevel==='Constantly'?2:q.stressLevel==='Most days'?1:0,'Morning cortisol is read against your pattern, and the report says what a high or flat result means for you.');
  if(q.steps)Lf('Movement',q.steps+' steps, '+(q.cardioDays||'0')+' cardio, '+(q.resistanceDays||'0')+' strength',q.steps==='<2,000'?2:q.resistanceDays==='0'?1:0,q.resistanceDays==='0'?'No strength work means testosterone, vitamin D and bone markers matter more, not less.':'Active people deplete iron and magnesium faster. Your ideal ranges account for it.');
  if(q.supplements)Lf('Supplements',q.supplements,0,'A "normal" vitamin D or B12 on supplements is a different result from one without. Your report knows which you are.');
  if(q.familyHistory)Lf('Family history',q.familyHistory,2,'The strongest reason to test Lp(a), ApoB and antibodies early. These are weighted up in your report.');
  if(q.medications)Lf('Medication',q.medications,1,'Each of these shifts specific markers. Your report reads them against the expected effect, not the standard range.');
  if(q.conditions)Lf('Conditions',q.conditions,2,'Tracked against the markers a specialist would monitor, and drift is flagged early.');
  document.getElementById('life').innerHTML=life.map(x=>'<div class="lf"><i style="background:'+LVL[Math.min(3,x.lv)][1]+'"></i><div><b>'+x.lab+'</b><em>'+x.val+'</em><p>'+x.note+'</p></div></div>').join('');
  fitFigure();
}
function openIdx(k){document.querySelectorAll('.idx li').forEach(l=>l.classList.remove('open'));const el=document.querySelector('.idx li[data-sys="'+k+'"]');if(el){el.classList.add('open');el.scrollIntoView({behavior:'smooth',block:'center'})}}
function fitFigure(){const svg=document.getElementById('fig');const mobile=window.innerWidth<720;svg.setAttribute('viewBox',mobile?'240 0 360 470':'0 0 840 470');document.getElementById('labels').style.display=mobile?'none':'';}

async function loadQuiz(){
  try{const r=await window.$memberstackDom.getCurrentMember();const m=r&&r.data;if(m&&m.customFields&&m.customFields['quiz-data']){const raw=m.customFields['quiz-data'];return {q:typeof raw==='string'?JSON.parse(raw):raw,m:m}}return {q:null,m:m||null}}catch(e){}
  try{const l=localStorage.getItem('truevitalsQuiz');if(l)return {q:JSON.parse(l),m:null}}catch(e){}
  return {q:null,m:null};
}
function getJourney(m){
  if(window.__tvJourneyPromise)return window.__tvJourneyPromise;
  if(!m||!m.id){window.__tvJourneyPromise=Promise.resolve(null);return window.__tvJourneyPromise}
  window.__tvJourneyPromise=fetch("https://truevitals-stripe-webhook.james-smillie-8c6.workers.dev/my-journey?email="+encodeURIComponent(m.auth.email)+"&member_id="+encodeURIComponent(m.id)).then(r=>r.json()).then(d=>d&&!d.error?d:null).catch(()=>null);
  window.__tvGetJourney=()=>window.__tvJourneyPromise;
  return window.__tvJourneyPromise;
}
async function init(){
  const root=document.getElementById('results');if(!root)return;
  const wait=()=>new Promise(res=>{let n=0;const t=setInterval(()=>{if(window.$memberstackDom||n++>30){clearInterval(t);res()}},100)});
  await wait();
  const {q,m}=await loadQuiz();
  const first=m&&m.customFields&&m.customFields['first-name'];
  if(!q){root.querySelector('.rhead h1').textContent='Complete your assessment to build your map.';root.querySelector('.rhead p').innerHTML='About three minutes. <a href="/quiz" style="color:#2ce4ad;font-weight:600">Start the assessment</a>.';document.querySelectorAll('.results .sec,.results .close,.rbar').forEach(e=>e.style.display='none');return}
  renderResults(q);
  if(first){const k=root.querySelector('.rhead .kicker');if(k)k.textContent=first+"'s health profile"}
  // dashboard mode: hide the pre-purchase sections once someone has bought or has a report
  if(root.dataset.mode==='dashboard'){
    getJourney(m).then(j=>{
      // same fallback as the journey card: if the CRM lookup fails, a Memberstack dashboard-url means a report exists
      const msUrl=m&&m.customFields&&m.customFields['dashboard-url'];
      const purchased=!!(j&&(j.live_order||(j.reports&&j.reports.length)))||(!j&&!!msUrl);
      if(purchased){
        // purchasers never see the preview map: it gets mistaken for the report
        root.style.display='none';document.querySelectorAll('.rbar').forEach(e=>e.style.display='none');
        const strip=document.createElement('div');strip.className='tvr-strip';
        strip.innerHTML='<span>Your assessment answers are on file and feed your report.</span><span class="tvr-strip-links"><a href="/quiz-results">See your body map</a><a href="/quiz">Update your answers</a></span>';
        root.parentElement.insertBefore(strip,root);
      }
    });
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

window.TVResults={render:renderResults};
})();
/* TrueVitals quiz, next version (12 Nov 2026). Built from quiz.js; answer keys and formats are unchanged.
   Changes: goals asked first, women-only options hidden from men, shorter end screen, and a shorter sign-up shown
   inside the quiz for people without an account (falls back to /join on any problem). */
(function(){
const A = {}; // answers
const Q = [
 {sec:"About you",id:"about",type:"fields",title:"A few basics first.",help:"Age, sex, height and weight change what a normal result looks like. Sex at birth decides which hormone and cancer markers apply.",noskip:true},
 {sec:"About you",id:"ethnicity",key:"ethnicity",legacy:true,type:"single",title:"Which best describes your ethnicity?",help:"Kidney, HbA1c, vitamin D and some blood-count ranges differ by ancestry.",opts:["White (European ancestry)","Black / African / Caribbean","South Asian (e.g. Indian, Pakistani, Bangladeshi)","East Asian (e.g. Chinese, Japanese, Korean)","Southeast Asian (e.g. Thai, Filipino, Vietnamese)","Middle Eastern","North African","West African","Mixed / Multiple ethnic groups","Latino / Hispanic","Jewish (Ashkenazi / Sephardic)","Indigenous / Aboriginal (e.g. Native American, Australian Aboriginal)"]},
 {sec:"Women's health",id:"women",type:"group",cond:()=>A.gender==="Female",title:"Your cycle and hormones.",help:"These change how oestradiol, SHBG, iron and thyroid results are read.",rows:[
   {key:"cycle",label:"Periods at the moment",opts:["Regular","Irregular","Heavy or painful","Stopped (perimenopause or menopause)","None for another reason"]},
   {key:"pregnancyStatus",label:"Pregnant, breastfeeding or trying?",opts:["None of these","Pregnant","Breastfeeding","Trying to conceive"]},
   {key:"hormonalMeds",label:"Contraception or HRT",multi:true,opts:["Combined pill","Progesterone-only pill or implant","Hormonal coil (IUS)","HRT"],none:"None"}]},
 {sec:"Diet",id:"dietType",key:"dietType",legacy:true,type:"single",title:"Which best describes how you eat?",opts:["Standard / Mixed Diet","Low-Carb / High-Protein","High-Carb / Low-Fat","Mediterranean Diet","Vegetarian (includes eggs and dairy)","Vegan (fully plant-based)","Pescatarian (vegetarian + fish)","Carnivore (mostly or exclusively animal products)","Keto / Very Low-Carb","Intermittent Fasting (timed eating)","Ultra-Processed / Fast Food Heavy","Takeaway / Convenience-Based Eating"]},
 {sec:"Diet",id:"diethabits",type:"group",title:"On a typical day.",help:"Three quick ones. These drive insulin, triglycerides and liver markers more than anything else you'll tell us.",rows:[
   {key:"vegPortions",label:"Portions of veg and fruit",opts:["0 to 1","2 to 3","4 to 5","6+"]},
   {key:"upfFrequency",label:"Takeaway or ultra-processed food",opts:["Rarely","Weekly","Most days","Daily"]},
   {key:"sugarFrequency",label:"Sugary drinks or snacks",opts:["Rarely","Some days","Daily","Several a day"]}]},
 {sec:"Diet",id:"portions",key:"appetite",type:"single",title:"How would you describe your appetite and portions?",help:"Eating well below your needs shows up in thyroid, iron and hormone results as clearly as eating well above them. Be honest, it only helps you.",opts:[["Small, or I often skip meals","dietConsistency:2"],["Slightly below average","dietConsistency:4"],["About average","dietConsistency:5"],["Larger than average","dietConsistency:7"],["I eat a lot","dietConsistency:9"]]},
 {sec:"Activity",id:"activity",type:"group",title:"Movement in a typical week.",help:"Cardio is anything that raises your heart rate for 20 minutes. Strength is weights or bodyweight.",rows:[
   {key:"steps",label:"Steps a day",opts:["<2,000","2,000–5,000","5,000–7,500","7,500–10,000","10,000–15,000","15,000+"]},
   {key:"cardioDays",label:"Cardio sessions",opts:["0","1","2","3","4","5+"]},
   {key:"resistanceDays",label:"Strength sessions",opts:["0","1","2","3","4","5+"]},
   {key:"trainingIntensity",label:"How hard, mostly",opts:["Easy","Moderate","Hard","Very hard"]}]},
 {sec:"Sleep and stress",id:"sleep",type:"group",title:"Sleep, stress and energy.",help:"Cortisol, thyroid and blood sugar all leave a signature in these.",rows:[
   {key:"sleepHours",label:"Sleep on a normal night",opts:["Under 6","6 to 7","7 to 8","8+"]},
   {key:"sleepQuality",label:"How you wake up",opts:["Refreshed","Slow to get going","Tired most mornings","Exhausted or waking in the night"]},
   {key:"stressLevel",label:"Stress feels hard to manage",opts:["Rarely","Some weeks","Most days","Constantly"]},
   {key:"energyPattern",label:"Energy through the day",opts:["Steady","Afternoon crash","Tired on waking","Wired at night","Low all day"]}]},
 {sec:"Alcohol and habits",id:"alcohol",key:"alcoholWeekly",type:"single",title:"Alcohol in a typical week?",help:"A drink is a pint, a glass of wine or a single measure. Liver markers respond to this fast, in both directions.",opts:["None","1 to 4","5 to 9","10 to 14","15 or more"]},
 {sec:"Alcohol and habits",id:"habits",key:"habits",legacy:true,type:"multi",title:"Do any of these apply?",opts:["Smoking tobacco","Vaping nicotine","Cannabis use","Recreational drug use (e.g. cocaine, MDMA)","Anabolic steroids or PEDs (e.g. testosterone, SARMs)","Overuse of caffeine or energy drinks","Frequent painkiller use (e.g. ibuprofen, paracetamol)","Night shifts or rotating shifts"],none:"None of these"},
 {sec:"Symptoms",id:"symptoms",key:"symptoms",legacy:true,type:"multi",max:4,title:"Anything you've been living with?",help:"Up to four. The first you pick is treated as the main one, and we'll ask how long.",opts:["Low Energy/Fatigue","Poor Sleep/Insomnia","Brain Fog","Low Mood/Anxiety","Bloating or Digestive Discomfort","Weight Gain / Difficulty Losing Weight","Low Sex Drive/Libido","Poor Exercise Recovery","Frequent Illness","Hair Thinning/Hair Loss","Skin Breakouts","Joint Pain/Stiffness","Irregular Periods","Palpitations or dizziness","Feeling cold, or cold hands and feet","Headaches"],none:"None right now",follow:{key:"symptomDuration",label:()=>"How long, for "+(A.symptoms&&A.symptoms[0]?A.symptoms[0].split("/")[0].toLowerCase():"this")+"?",opts:["Weeks","Months","Over a year","Always"]}},
 {sec:"History",id:"conditions",key:"conditions",legacy:true,type:"searchmulti",title:"Any diagnosed conditions?",help:"Type to search. Choose None if nothing applies. Diagnosed conditions change which markers your report watches most closely.",opts:["Type 2 Diabetes","Type 1 Diabetes","Prediabetes","Polycystic Ovary Syndrome (PCOS)","Endometriosis","Hypothyroidism (e.g. Hashimoto's)","Hyperthyroidism (e.g. Graves' Disease)","Rheumatoid Arthritis","Systemic Lupus Erythematosus (SLE)","Coeliac Disease","Crohn's Disease","Ulcerative Colitis","IBS","Non-Alcoholic Fatty Liver Disease (NAFLD)","Chronic Kidney Disease (CKD)","Coronary Artery Disease / Ischemic Heart Disease","Hypertension (High Blood Pressure)","High cholesterol","Asthma","Psoriasis","Eczema","Alopecia Areata","Acne Vulgaris","Anaemia","Osteoporosis or osteopenia","Gout","Chronic Fatigue Syndrome (ME/CFS)","Long COVID / Post-Viral Syndrome","Major Depressive Disorder","Anxiety disorder","ADHD","Migraine","Sleep apnoea"],none:"None"},
 {sec:"History",id:"medications",key:"medications",legacy:true,type:"searchmulti",title:"Any prescribed medication?",help:"Many change results directly. Statins lower ApoB, the pill raises SHBG, metformin lowers B12. Your report reads around them, but only if it knows.",opts:["Statins","Metformin","Levothyroxine","Oral Contraceptives (Combined Pill)","HRT (Hormone Replacement Therapy)","Testosterone Replacement Therapy (TRT)","Mounjaro, Wegovy or Ozempic (GLP-1)","SSRIs (e.g. Sertraline, Fluoxetine)","SNRIs (e.g. Venlafaxine, Duloxetine)","Proton Pump Inhibitors (PPIs, e.g. Omeprazole)","Corticosteroids (e.g. Prednisolone)","Diuretics (e.g. Furosemide, Bendroflumethiazide)","ACE Inhibitors (e.g. Ramipril)","ARBs (e.g. Losartan)","Antipsychotics (e.g. Olanzapine, Risperidone)","Beta-Blockers (e.g. Propranolol, Bisoprolol)","Oral Anticoagulants (e.g. Warfarin)","Antiepileptics (e.g. Carbamazepine, Phenytoin)","Insulin","Combined Injectable Contraceptives (e.g. Depo-Provera)","Anti-androgens (e.g. Spironolactone)","ADHD medication (e.g. methylphenidate)","Finasteride","Allopurinol","Biologics or immunosuppressants"],none:"None"},
 {sec:"History",id:"supplements",key:"supplements",type:"multi",title:"Supplements you take most days?",help:"A normal vitamin D on 4,000 IU a day is a different result from a normal vitamin D on nothing.",opts:["Vitamin D","Vitamin B12","Iron","Magnesium","Omega-3 / fish oil","Multivitamin","Creatine","Protein powder","Zinc","Probiotics"],none:"None"},
 {sec:"History",id:"family",key:"familyHistory",type:"multi",title:"Has a parent, brother or sister had any of these?",help:"Family history is the strongest reason to test some markers early, and the one thing no blood test can tell us.",opts:["Heart attack or stroke before 60","Type 2 diabetes","Thyroid disease","An autoimmune condition","Bowel, breast, prostate or ovarian cancer","Osteoporosis","Dementia"],none:"None that I know of"},
 {sec:"History",id:"prevtest",key:"previousTest",type:"single",title:"Had a blood test in the last 12 months?",opts:["No","Yes, everything was normal","Yes, something was flagged","Yes, but I never saw the results"]},
 {sec:"Goals",id:"goals",key:"goals",legacy:true,type:"multi",max:3,title:"What matters most to you?",help:"Up to three.",opts:["Lose Body Fat","Build Muscle","Improve Energy Levels","Improve Mood","Balance Hormones","Improve Digestion and Gut Health","Boost Immune System","Improve Long-Term Health/Longevity","Prevent Disease","Improve Sleep Quality","Reduce Stress and Anxiety","Improve Cardiovascular Fitness"]},
 {sec:"Anything else",id:"context",key:"additionalContext",legacy:true,type:"text",title:"Anything else your report should know?",help:"Optional. Symptoms a GP has dismissed, previous findings, what you're already doing. This goes only to the person writing your report, and it's often the most useful thing on the form."}
];

// goals first: an easy, motivating tap before date of birth, height and weight
(function(){const i=Q.findIndex(q=>q.id==='goals');if(i>0){Q.unshift(Q.splice(i,1)[0])}})();
// options that only apply to women are not offered to men
const MALE_HIDE={symptoms:["Irregular Periods"],conditions:["Polycystic Ovary Syndrome (PCOS)","Endometriosis"],medications:["Oral Contraceptives (Combined Pill)","HRT (Hormone Replacement Therapy)","Combined Injectable Contraceptives (e.g. Depo-Provera)"]};
function optsFor(q){const hide=A.gender==='Male'?(MALE_HIDE[q.id]||[]):[];return hide.length?q.opts.filter(o=>!hide.includes(Array.isArray(o)?o[0]:o)):q.opts}

// Answers that cannot both be true (6 Nov 2026: a quiz came in as progesterone-only pill + combined pill + pregnant or breastfeeding)
const EXCL={"Combined pill":["Progesterone-only pill or implant","HRT"],"Progesterone-only pill or implant":["Combined pill"],"HRT":["Combined pill"]};
const PREG_EXCL={"Pregnant":["Combined pill","Progesterone-only pill or implant","Hormonal coil (IUS)","HRT"],"Breastfeeding":["HRT"],"Trying to conceive":["Combined pill","Progesterone-only pill or implant","Hormonal coil (IUS)","HRT"]};
const THEME={"About you":{c:"#2ce4ad",bg:"rgba(44,228,173,.12)",ico:"user",art:"rings"},"Women's health":{c:"#f0648c",bg:"rgba(240,100,140,.12)",ico:"moon",art:"cycle"},"Diet":{c:"#7cc242",bg:"rgba(124,194,66,.14)",ico:"leaf",art:"plate"},"Activity":{c:"#f3803d",bg:"rgba(243,128,61,.14)",ico:"pulse",art:"pulse"},"Sleep and stress":{c:"#6b7cf5",bg:"rgba(107,124,245,.14)",ico:"moon",art:"moon"},"Alcohol and habits":{c:"#f5b82e",bg:"rgba(245,184,46,.16)",ico:"glass",art:"glass"},"Symptoms":{c:"#ef5a5a",bg:"rgba(239,90,90,.12)",ico:"heart",art:"heartbeat"},"History":{c:"#c9a96e",bg:"rgba(201,169,110,.16)",ico:"dna",art:"dna"},"Goals":{c:"#2ce4ad",bg:"rgba(44,228,173,.12)",ico:"target",art:"target"},"Anything else":{c:"#8a919a",bg:"rgba(138,145,154,.14)",ico:"pen",art:"pen"}};
const ICO={user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',moon:'<path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11z"/>',leaf:'<path d="M4 20C4 10 12 4 20 4c0 8-6 16-16 16z"/><path d="M4 20l8-8"/>',pulse:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',glass:'<path d="M6 3h12l-1 7a5 5 0 0 1-10 0z"/><path d="M12 15v6M8 21h8"/>',heart:'<path d="M12 21s-8-5-8-11a4 4 0 0 1 8-2 4 4 0 0 1 8 2c0 6-8 11-8 11z"/>',dna:'<path d="M6 3c0 6 12 6 12 12M18 3c0 6-12 6-12 12M6 21c0-6 12-6 12-12M18 21c0-6-12-6-12-12"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',pen:'<path d="M4 20l4-1L19 8l-3-3L5 16z"/>',
 fork:'<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 6v3h3v9"/>',fish:'<path d="M3 12c4-5 10-5 14 0-4 5-10 5-14 0z"/><path d="M17 12l4-4v8z"/>',carrot:'<path d="M15 9l6-6M13 3l2 2M19 9l2 2M14 10l-9 9a2 2 0 0 0 3 3l9-9a3 3 0 0 0-3-3z"/>',steak:'<path d="M4 12a8 6 0 0 1 16 0 6 6 0 0 1-8 6c-5 0-8-2-8-6z"/>',burger:'<path d="M4 10h16a8 5 0 0 0-16 0zM4 14h16M5 18h14a2 2 0 0 0 0-4H5a2 2 0 0 0 0 4z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',egg:'<path d="M12 3c4 0 7 6 7 11a7 7 0 0 1-14 0c0-5 3-11 7-11z"/>',
 steps:'<path d="M8 4c2 0 3 2 3 5s-1 5-3 5-3-2-3-5 1-5 3-5zM16 8c2 0 3 2 3 5s-1 5-3 5-3-2-3-5 1-5 3-5z"/>',dumbbell:'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',run:'<circle cx="16" cy="4" r="2"/><path d="M6 21l4-6 3 2 2-6-4-2-3 4M13 11l3 2 3 6"/>',
 bed:'<path d="M3 18v-8h18v8M3 14h18M6 10V7h5v3"/>',bolt:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',cloud:'<path d="M7 18a4 4 0 0 1 0-8 6 6 0 0 1 11 2 3 3 0 0 1 0 6z"/>',
 smoke:'<path d="M4 16h12v3H4zM18 16h2v3h-2M18 5c2 2 0 4 2 6M14 5c2 2 0 4 2 6"/>',pill:'<path d="M9 3l12 12a4 4 0 0 1-6 6L3 9a4 4 0 0 1 6-6zM6 6l12 12"/>',
 brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5v1a3 3 0 0 0 6 0V6a3 3 0 0 0-3-2zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5v1a3 3 0 0 1-6 0V6a3 3 0 0 1 3-2z"/>',gut:'<path d="M6 6h12a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h10"/>',scale:'<path d="M12 3v18M4 7h16M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>',fire:'<path d="M12 21a6 6 0 0 1-6-6c0-4 4-6 4-10 3 2 5 5 5 8 2-1 3-3 3-5 1 2 2 4 2 7a6 6 0 0 1-8 6z"/>',shield:'<path d="M12 3l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V6z"/>',hair:'<path d="M12 4c4 0 7 3 7 7v9M5 20v-9c0-4 3-7 7-7M9 12v8M15 12v8"/>',bone:'<path d="M7 4a2 2 0 0 1 3 2l4 4a2 2 0 0 1 3 2 2 2 0 0 1-3 3l-4-4a2 2 0 0 1-3-2z"/>',drop:'<path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/>',snow:'<path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/>',head:'<circle cx="12" cy="9" r="6"/><path d="M9 15l3 6 3-6"/>',ill:'<circle cx="12" cy="12" r="9"/><path d="M8 15c2-2 6-2 8 0M9 10h.01M15 10h.01"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
 cap:'<path d="M12 3l10 5-10 5L2 8z"/><path d="M6 10v5c0 2 3 4 6 4s6-2 6-4v-5"/>',family:'<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21c0-4 3-7 6-7s6 3 6 7M14 21c0-3 1.5-5 3-5s4 2 4 5"/>',lab:'<path d="M9 3v7L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M8 3h8"/>',zap:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',spark:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>'};
const OPT_ICO=[['Standard / Mixed','fork'],['Low-Carb','steak'],['High-Carb','carrot'],['Mediterranean','fish'],['Vegetarian','egg'],['Vegan','leaf'],['Pescatarian','fish'],['Carnivore','steak'],['Keto','steak'],['Intermittent','clock'],['Ultra-Processed','burger'],['Takeaway','burger'],
 ['Smoking','smoke'],['Vaping','smoke'],['Cannabis','leaf'],['Recreational','pill'],['Anabolic','dumbbell'],['caffeine','bolt'],['painkiller','pill'],['Night shifts','moon'],
 ['Low Energy','bolt'],['Poor Sleep','bed'],['Brain Fog','cloud'],['Low Mood','head'],['Bloating','gut'],['Weight Gain','scale'],['Low Sex Drive','fire'],['Poor Exercise','run'],['Frequent Illness','ill'],['Hair','hair'],['Skin','sun'],['Joint','bone'],['Irregular Periods','drop'],['Palpitations','heart'],['Feeling cold','snow'],['Headaches','head'],
 ['Lose Body Fat','fire'],['Build Muscle','dumbbell'],['Improve Energy','bolt'],['Improve Mood','sun'],['Balance Hormones','scale'],['Improve Digestion','gut'],['Boost Immune','shield'],['Long-Term','dna'],['Prevent Disease','shield'],['Improve Sleep','moon'],['Reduce Stress','cloud'],['Cardiovascular','heart'],
 ['Vitamin D','sun'],['Vitamin B12','zap'],['Iron','drop'],['Magnesium','moon'],['Omega','fish'],['Multivitamin','pill'],['Creatine','dumbbell'],['Protein','dumbbell'],['Zinc','shield'],['Probiotics','gut'],
 ['Heart attack','heart'],['Type 2 diabetes','drop'],['Thyroid disease','spark'],['autoimmune','shield'],['cancer','lab'],['Osteoporosis','bone'],['Dementia','brain']];
function optIcon(label){for(const [k,i] of OPT_ICO){if(label.includes(k))return '<span class="ico"><svg viewBox="0 0 24 24">'+ICO[i]+'</svg></span>'}return ''}
const ART={rings:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.2"><circle cx="150" cy="150" r="120" opacity=".25"/><circle cx="150" cy="150" r="90" opacity=".4"/><circle cx="150" cy="150" r="60" opacity=".6"/><circle cx="150" cy="150" r="30" opacity=".9"/><circle cx="150" cy="150" r="4" fill="C"/></svg>',
 cycle:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.2"><circle cx="150" cy="150" r="110" opacity=".3"/><path d="M150 40a110 110 0 0 1 95 55" stroke-width="6" stroke-linecap="round" opacity=".8"/><circle cx="150" cy="40" r="7" fill="C"/><circle cx="245" cy="95" r="5" fill="C" opacity=".6"/></svg>',
 plate:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.2"><circle cx="150" cy="160" r="110" opacity=".3"/><circle cx="150" cy="160" r="82" opacity=".5"/><path d="M150 78a82 82 0 0 1 71 41L150 160z" fill="C" opacity=".18" stroke="none"/><path d="M40 40v40M52 40v40M46 80v60M260 40c-10 8-10 30 0 40v60" opacity=".7"/></svg>',
 pulse:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="2"><path d="M0 160h60l20-50 30 100 30-120 25 70h135" opacity=".85"/><path d="M0 200h300" opacity=".15"/><path d="M0 120h300" opacity=".15"/></svg>',
 moon:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.2"><path d="M200 60a100 100 0 1 0 60 140 80 80 0 0 1-60-140z" fill="C" opacity=".15" stroke="none"/><path d="M200 60a100 100 0 1 0 60 140 80 80 0 0 1-60-140z" opacity=".7"/><circle cx="80" cy="60" r="3" fill="C"/><circle cx="60" cy="120" r="2" fill="C"/><circle cx="240" cy="40" r="2" fill="C"/></svg>',
 glass:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.5"><path d="M90 40h120l-14 110a46 46 0 0 1-92 0z" opacity=".7"/><path d="M104 120h92" opacity=".4"/><path d="M150 196v70M110 266h80" opacity=".7"/><circle cx="130" cy="90" r="6" opacity=".5"/><circle cx="170" cy="70" r="4" opacity=".5"/></svg>',
 heartbeat:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.5"><path d="M150 250S40 180 40 110a55 55 0 0 1 110-10 55 55 0 0 1 110 10c0 70-110 140-110 140z" opacity=".6"/><path d="M60 150h50l15-30 20 60 20-40 10 10h65" stroke-width="2.5"/></svg>',
 dna:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.5"><path d="M90 20c0 60 120 60 120 130s-120 70-120 130M210 20c0 60-120 60-120 130s120 70 120 130" opacity=".7"/><path d="M96 60h108M100 100h100M110 140h80M100 180h100M96 220h108" opacity=".35"/></svg>',
 target:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.5"><circle cx="150" cy="150" r="110" opacity=".3"/><circle cx="150" cy="150" r="75" opacity=".5"/><circle cx="150" cy="150" r="40" opacity=".7"/><circle cx="150" cy="150" r="8" fill="C"/><path d="M150 150L260 40M240 40h20v20" stroke-width="2"/></svg>',
 pen:'<svg viewBox="0 0 300 300" fill="none" stroke="C" stroke-width="1.5"><path d="M60 240L200 100l30 30L90 270l-40 10z" opacity=".7"/><path d="M60 120h80M60 150h60M60 180h40" opacity=".35"/></svg>'};
let idx=0, order=[];
function visible(){return Q.filter(q=>!q.cond||q.cond())}
function startQuiz(){document.getElementById('intro').style.display='none';document.getElementById('quiz').classList.add('on');idx=0;render();window.scrollTo(0,0)}
function render(){
  order=visible(); const q=order[idx]; const host=document.getElementById('qhost'); host.innerHTML='';const T=THEME[q.sec]||THEME['Goals'];document.documentElement.style.setProperty('--sec',T.c);
  document.getElementById('prog').style.width=((idx)/(order.length-1)*100)+'%';
  document.getElementById('qcount').innerHTML=(idx+1)+'<span> / '+order.length+'</span>';
  document.getElementById('back').style.visibility=idx===0?'hidden':'visible';
  document.getElementById('skip').style.display=q.noskip?'none':'';
  document.getElementById('next').textContent=idx===order.length-1?'See my results':'Continue';document.getElementById('next').classList.toggle('teal',idx===order.length-1);
  const scene=document.createElement('div');scene.className='qscene';scene.innerHTML='<div class="qart">'+(ART[T.art]||'').replace(/"C"/g,'"'+T.c+'"')+'</div>';host.appendChild(scene);const sec=document.createElement('div');sec.className='qsec';sec.style.background=T.bg;sec.style.color=T.c;sec.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+ICO[T.ico]+'</svg>'+q.sec;scene.appendChild(sec);
  const el=document.createElement('div');el.className='q on';
  const title=typeof q.title==='function'?q.title():q.title;
  let h='<h2>'+title+'</h2>'+(q.help?'<p class="help">'+q.help+'</p>':'');
  if(q.type==='fields'){
    h+=fieldsHTML();
    if(false)h+='<div class="field"><div><label>Date of birth</label><input type="date" id="f_dob" value="'+(A.dob||'')+'"></div><div><label>Sex at birth</label><select id="f_sex"><option value="">Choose</option><option'+(A.gender==='Male'?' selected':'')+'>Male</option><option'+(A.gender==='Female'?' selected':'')+'>Female</option><option'+(A.gender==='Prefer not to say'?' selected':'')+'>Prefer not to say</option></select></div><div><label>Height (cm)</label><input type="number" id="f_h" placeholder="175" value="'+(A.height||'')+'"></div><div><label>Weight (kg)</label><input type="number" id="f_w" placeholder="75" value="'+(A.weight||'')+'"></div></div><div class="err" id="ferr">Date of birth and sex at birth are needed to read your results correctly. Everything else on this page is optional.</div>';
  } else if(q.type==='group'){
    h+=q.rows.map(r=>{const cur=A[r.key];const on=v=>r.multi?(Array.isArray(cur)&&cur.includes(v)):cur===v;return '<div class="grow"><div class="glabel">'+r.label+'</div><div class="gchips">'+r.opts.map(o=>'<button type="button" class="gchip'+(on(o)?' on':'')+'" data-k="'+r.key+'" data-v="'+o.replace(/"/g,'&quot;')+'">'+o+'</button>').join('')+(r.none?'<button type="button" class="gchip none'+(cur==='__none'?' on':'')+'" data-k="'+r.key+'" data-v="__none">'+r.none+'</button>':'')+'</div></div>'}).join('');
  } else if(q.type==='fields2'){
    h+='<div class="field"><div><label>Cardio sessions a week</label><select id="f_cardio">'+['0','1','2','3','4','5+'].map(v=>'<option'+(A.cardioDays===v?' selected':'')+'>'+v+'</option>').join('')+'</select></div><div><label>Strength sessions a week</label><select id="f_res">'+['0','1','2','3','4','5+'].map(v=>'<option'+(A.resistanceDays===v?' selected':'')+'>'+v+'</option>').join('')+'</select></div></div>';
  } else if(q.type==='text'){
    h+='<textarea id="f_ctx" rows="5" style="width:100%;padding:14px 16px;font-size:.95rem;border:1.5px solid #e0e8e4;border-radius:12px;font-family:inherit;line-height:1.6" placeholder="e.g. My GP said my bloods were normal but I still feel exhausted. I take vitamin D and magnesium. I work night shifts three days a week.">'+(A.additionalContext||'')+'</textarea>';
  } else if(q.type==='searchmulti'){
    const cur=A[q.key]||[];
    h+='<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg><input id="srch" placeholder="Start typing, e.g. thyroid" autocomplete="off"></div><div class="tags" id="tags"></div><div class="chips" id="list"></div>';
  } else {
    const cur=A[q.key]; const multi=q.type==='multi';
    h+='<div class="chips '+(q.cols===2?'two':'auto')+'">'+optsFor(q).map(o=>{const label=Array.isArray(o)?o[0]:o;const on=multi?(cur||[]).includes(label):cur===label;const ic=optIcon(label);return '<button type="button" class="chip'+(multi?' multi':'')+(on?' on':'')+'" data-v="'+label.replace(/"/g,'&quot;')+'">'+(ic||'<span class="tick">'+(on?'✓':'')+'</span>')+'<span>'+label+'</span>'+(ic?'<span class="tick" style="margin-left:auto">'+(on?'✓':'')+'</span>':'')+'</button>'}).join('')+(q.none?'<button type="button" class="chip none'+(cur==='__none'?' on':'')+'" data-v="__none"><span class="tick">'+(cur==='__none'?'✓':'')+'</span><span>'+q.none+'</span></button>':'')+'</div>';
    if(multi&&q.follow&&Array.isArray(cur)&&cur.length){const f=q.follow;const fv=A[f.key];h+='<div class="grow" style="margin-top:22px"><div class="glabel">'+f.label()+'</div><div class="gchips">'+f.opts.map(o=>'<button type="button" class="gchip'+(fv===o?' on':'')+'" data-k="'+f.key+'" data-v="'+o+'">'+o+'</button>').join('')+'</div></div>'}
    if(multi&&q.max)h+='<div class="note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>Up to '+q.max+'. The first one you pick is treated as your main one.</div>';
  }
  el.innerHTML=h; scene.appendChild(el);
  // bind
  if(q.type==='single'||q.type==='multi'){
    el.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{
      const v=b.dataset.v;
      if(q.type==='single'){ A[q.key]=v==='__none'?'__none':v; const o=q.opts.find(x=>Array.isArray(x)&&x[0]===v); if(o){const [k,val]=o[1].split(':');A[k]=val} const at=idx; render(); setTimeout(()=>{if(idx===at&&!finished)go(1)},180); }
      else {
        if(v==='__none'){A[q.key]='__none';render();return}
        let cur=Array.isArray(A[q.key])?A[q.key].slice():[];
        if(cur.includes(v))cur=cur.filter(x=>x!==v); else { if(q.max&&cur.length>=q.max)return; cur.push(v) }
        A[q.key]=cur; render();
      }
    });
  }
  el.querySelectorAll('.gchip').forEach(b=>b.onclick=()=>{const k=b.dataset.k,v=b.dataset.v;const row=(q.rows||[]).find(r=>r.key===k);if(row&&row.multi){if(v==='__none'){A[k]='__none'}else{let c=Array.isArray(A[k])?A[k].slice():[];const adding=!c.includes(v);c=adding?c.concat(v):c.filter(x=>x!==v);if(adding&&EXCL[v])c=c.filter(x=>!EXCL[v].includes(x));A[k]=c}}else{A[k]=v}
    // contraception that cannot go with the pregnancy answer is cleared, and the other way round
    if(k==='pregnancyStatus'&&PREG_EXCL[v]&&Array.isArray(A.hormonalMeds)){A.hormonalMeds=A.hormonalMeds.filter(x=>!PREG_EXCL[v].includes(x));if(!A.hormonalMeds.length)A.hormonalMeds=undefined}
    if(k==='hormonalMeds'&&v!=='__none'&&A.pregnancyStatus&&(PREG_EXCL[A.pregnancyStatus]||[]).includes(v))A.pregnancyStatus='None of these';
    render()});
  if(q.type==='searchmulti'){
    const inp=el.querySelector('#srch'),list=el.querySelector('#list'),tags=el.querySelector('#tags');
    function drawTags(){const cur=A[q.key];tags.innerHTML=cur==='__none'?'<span class="tag">'+q.none+'<button onclick="TVQuiz.clear(\''+q.key+'\')">×</button></span>':(cur||[]).map(v=>'<span class="tag">'+v+'<button data-r="'+v.replace(/"/g,'&quot;')+'">×</button></span>').join('');tags.querySelectorAll('button[data-r]').forEach(b=>b.onclick=()=>{A[q.key]=A[q.key].filter(x=>x!==b.dataset.r);drawTags();drawList()})}
    function drawList(){const t=inp.value.trim().toLowerCase();const cur=Array.isArray(A[q.key])?A[q.key]:[];const items=optsFor(q).filter(o=>!(q.id==='medications'&&A.gender==="Female"&&/Combined Pill|Hormone Replacement/.test(o))).filter(o=>!cur.includes(o)&&(!t||o.toLowerCase().includes(t))).slice(0,t?12:6);list.innerHTML=items.map(o=>'<button type="button" class="chip" data-v="'+o.replace(/"/g,'&quot;')+'"><span class="tick"></span><span>'+o+'</span></button>').join('')+(!t&&A[q.key]!=='__none'?'<button type="button" class="chip none" data-v="__none"><span class="tick"></span><span>'+q.none+'</span></button>':'');list.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{if(b.dataset.v==='__none'){A[q.key]='__none'}else{const c=Array.isArray(A[q.key])?A[q.key].slice():[];c.push(b.dataset.v);A[q.key]=c}inp.value='';drawTags();drawList()})}
    inp.oninput=drawList;drawTags();drawList();
  }
  window.scrollTo({top:0});
}
function collect(){
  const q=order[idx];
  if(q.type==='fields'){if(!readFields())return false}
  if(q.type==='text'){A.additionalContext=document.getElementById('f_ctx').value}
  return true;
}
let finished=false;
function go(d){ if(finished)return; order=visible(); if(idx>=order.length)return; if(d>0&&!collect())return; idx+=d; if(idx<0)idx=0; if(idx>=order.length){finished=true;finish();return} render(); }
function skipQ(){const q=order[idx];if(q.rows)q.rows.forEach(r=>A[r.key]=undefined);else A[q.key]=undefined;if(q.follow)A[q.follow.key]=undefined;go(1)}
function finish(){
  const out={quiz_version:"v2"};
  const keys=[];for(const q of Q){if(q.key)keys.push(q.key);if(q.rows)q.rows.forEach(r=>keys.push(r.key));if(q.follow)keys.push(q.follow.key)}
  for(const k of keys){ const v=A[k]; if(v===undefined||v==='__none')continue; out[k]=Array.isArray(v)?v.join(', '):v }
  ['dob','gender','height','weight','dietConsistency','additionalContext'].forEach(k=>{if(A[k])out[k]=A[k]});
  if(A.conditions==='__none')out.hasConditions='no'; else if(Array.isArray(A.conditions)&&A.conditions.length)out.hasConditions='yes';
  if(A.medications==='__none')out.hasMedications='no'; else if(Array.isArray(A.medications)&&A.medications.length)out.hasMedications='yes';
  const quizJSON=JSON.stringify(out);
  try{localStorage.setItem("truevitalsQuiz",quizJSON)}catch(e){}
  document.getElementById('quiz').classList.remove('on');document.getElementById('build').classList.add('on');window.scrollTo(0,0);
  const started=Date.now();
  function go(url){const wait=Math.max(0,900-(Date.now()-started));setTimeout(()=>{window.location.href=url},wait)}
  function save(){
    try{
      const t=setInterval(()=>{
        if(!window.$memberstackDom)return; clearInterval(t);
        window.$memberstackDom.getCurrentMember().then(r=>{
          const m=r&&r.data;
          if(m&&m.id){ window.$memberstackDom.updateMember({customFields:{"quiz-data":quizJSON}}).then(()=>go('/dashboard')).catch(()=>go('/dashboard')) }
          else setTimeout(()=>{try{gate(quizJSON)}catch(e){go('/join?redirect=/dashboard')}},Math.max(0,900-(Date.now()-started)));
        }).catch(()=>go('/join?redirect=/dashboard'));
      },100);
      setTimeout(()=>{if(!window.$memberstackDom)go('/join')},4000);
    }catch(e){go('/join')}
  }
  save();
}

const U={h:'cm',w:'kg'};
function fieldsHTML(){
  const hCm=A.height||'';const wKg=A.weight||'';
  const ft=hCm?Math.floor(hCm/30.48):'',inch=hCm?Math.round(hCm/2.54-ft*12):'';
  const lb=wKg?Math.round(wKg*2.2046):'',st=wKg?Math.floor(wKg/6.35029):'',stlb=wKg?Math.round((wKg/6.35029-st)*14):'';
  return '<div class="field">'+
   '<div><label>Date of birth</label><input type="date" id="f_dob" value="'+(A.dob||'')+'"></div>'+
   '<div><label>Sex at birth</label><select id="f_sex"><option value="">Choose</option><option'+(A.gender==='Male'?' selected':'')+'>Male</option><option'+(A.gender==='Female'?' selected':'')+'>Female</option><option'+(A.gender==='Prefer not to say'?' selected':'')+'>Prefer not to say</option></select></div>'+
   '<div><label>Height <span class="units"><button type="button" class="'+(U.h==='cm'?'on':'')+'" onclick="TVQuiz.U.h=\'cm\';TVQuiz.render()">cm</button><button type="button" class="'+(U.h==='ft'?'on':'')+'" onclick="TVQuiz.U.h=\'ft\';TVQuiz.render()">ft in</button></span></label>'+(U.h==='cm'?'<input type="number" id="f_h" placeholder="175" value="'+hCm+'">':'<div class="dual"><input type="number" id="f_ft" placeholder="5 ft" value="'+ft+'"><input type="number" id="f_in" placeholder="9 in" value="'+inch+'"></div>')+'</div>'+
   '<div><label>Weight <span class="units"><button type="button" class="'+(U.w==='kg'?'on':'')+'" onclick="TVQuiz.U.w=\'kg\';TVQuiz.render()">kg</button><button type="button" class="'+(U.w==='lb'?'on':'')+'" onclick="TVQuiz.U.w=\'lb\';TVQuiz.render()">lb</button><button type="button" class="'+(U.w==='st'?'on':'')+'" onclick="TVQuiz.U.w=\'st\';TVQuiz.render()">st lb</button></span></label>'+(U.w==='kg'?'<input type="number" id="f_w" placeholder="75" value="'+wKg+'">':U.w==='lb'?'<input type="number" id="f_lb" placeholder="165" value="'+lb+'">':'<div class="dual"><input type="number" id="f_st" placeholder="11 st" value="'+st+'"><input type="number" id="f_stlb" placeholder="11 lb" value="'+stlb+'"></div>')+'</div>'+
   '</div><div class="err" id="ferr">Date of birth and sex at birth are needed to read results correctly. Height and weight are optional but let us calculate BMI.</div>';
}
function readFields(){
  const g=id=>document.getElementById(id);
  const dob=g('f_dob').value,sex=g('f_sex').value;if(!dob||!sex){g('ferr').classList.add('on');return false}
  A.dob=dob;A.gender=sex;
  if(U.h==='cm'){A.height=g('f_h').value}else{const f=parseFloat(g('f_ft').value)||0,i=parseFloat(g('f_in').value)||0;A.height=f||i?String(Math.round(f*30.48+i*2.54)):''}
  // sanity: a height under 3 metres and over 1.2, a weight between 30 and 300 kg; anything else is a units slip
  const hn=parseFloat(A.height),wn=parseFloat(A.weight!==undefined?A.weight:g('f_w')&&g('f_w').value);
  if(A.height&&(isNaN(hn)||hn<120||hn>230)){g('ferr').textContent=U.h==='cm'?'Height should be in centimetres, for example 172. Switch to ft in if that is easier.':'Check the height, it does not look right.';g('ferr').classList.add('on');return false}
  if(U.w==='kg'){A.weight=g('f_w').value}else if(U.w==='lb'){const l=parseFloat(g('f_lb').value);A.weight=l?String(Math.round(l/2.2046*10)/10):''}else{const st=parseFloat(g('f_st').value)||0,l=parseFloat(g('f_stlb').value)||0;A.weight=st||l?String(Math.round((st*6.35029+l/2.2046)*10)/10):''}
  const wv=parseFloat(A.weight);if(A.weight&&(isNaN(wv)||wv<30||wv>300)){g('ferr').textContent=U.w==='kg'?'Weight should be in kilograms, for example 75. Switch to lb or st lb if that is easier.':'Check the weight, it does not look right.';g('ferr').classList.add('on');return false}
  return true;
}

/* ---------- shorter sign-up, shown inside the quiz to people without an account ---------- */
const ASSET='https://results.truevitals.co.uk/assets/';
function nav(u){if(typeof window.__tvNav==='function')window.__tvNav(u);else window.location.href=u}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function loadSummary(q){return new Promise(res=>{
  const done=()=>{try{res(window.TVResults&&window.TVResults.summary?window.TVResults.summary(q):null)}catch(e){res(null)}};
  if(window.TVResults&&window.TVResults.summary){done();return}
  let fired=false;const once=()=>{if(!fired){fired=true;done()}};
  try{const s=document.createElement('script');s.src=ASSET+'quiz-results-4.js';s.onload=once;s.onerror=once;document.head.appendChild(s)}catch(e){once()}
  setTimeout(once,2500);
})}
function gate(quizJSON){
  let q={};try{q=JSON.parse(quizJSON)}catch(e){}
  const b=document.getElementById('build');if(b)b.classList.remove('on');
  if(!document.getElementById('tvgate-css')){const st=document.createElement('style');st.id='tvgate-css';st.textContent=
   '#tvgate{position:fixed;inset:0;z-index:70;background:#07090d;color:#fff;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:Montserrat,sans-serif}'+
   '#tvgate *{box-sizing:border-box}'+
   '#tvgate .gw{max-width:980px;margin:0 auto;padding:34px 22px 56px;display:grid;gap:26px}'+
   '@media(min-width:900px){#tvgate .gw{grid-template-columns:1.05fr .95fr;gap:48px;padding:64px 32px;align-items:start}}'+
   '#tvgate .gk{font-size:.8rem;font-weight:600;color:#2ce4ad;margin-bottom:12px}'+
   '#tvgate h1{font-family:"Inter Tight",sans-serif;font-weight:800;letter-spacing:-.03em;line-height:1.05;font-size:clamp(1.9rem,6.4vw,3rem);margin:0 0 12px;color:#fff}'+
   '#tvgate h1 em{font-style:normal;color:#2ce4ad}'+
   '#tvgate .gs{color:rgba(255,255,255,.62);font-size:.95rem;line-height:1.65;margin:0 0 20px;max-width:46ch}'+
   '#tvgate .gl{list-style:none;margin:0;padding:0;border-top:1px solid rgba(255,255,255,.1)}'+
   '#tvgate .gl li{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.08);font-family:"Inter Tight",sans-serif;font-weight:700;font-size:1rem}'+
   '#tvgate .gl li span{font-family:Montserrat,sans-serif;font-size:.74rem;font-weight:600;white-space:nowrap}'+
   '#tvgate .gl li.lock{color:rgba(255,255,255,.4);font-weight:600;font-size:.9rem}'+
   '#tvgate .gl li.lock span{color:rgba(255,255,255,.35)}'+
   '#tvgate .gc{background:#fff;color:#0c1512;border-radius:20px;padding:26px 22px}'+
   '@media(min-width:900px){#tvgate .gc{padding:34px 32px;position:sticky;top:32px}}'+
   '#tvgate .gc h2{font-family:"Inter Tight",sans-serif;font-weight:800;font-size:1.45rem;letter-spacing:-.02em;margin:0 0 6px;color:#0c1512}'+
   '#tvgate .gc p.sub{font-size:.86rem;color:#51605a;line-height:1.55;margin:0 0 18px}'+
   '#tvgate label.f{display:block;font-size:.78rem;font-weight:600;margin:0 0 6px;color:#0c1512}'+
   '#tvgate input.t{width:100%;padding:14px 14px;border:1.5px solid #d9e2de;border-radius:12px;font:inherit;font-size:1rem;margin:0 0 14px;background:#fff;color:#0c1512}'+
   '#tvgate input.t:focus{outline:2px solid #2ce4ad;outline-offset:1px;border-color:#2ce4ad}'+
   '#tvgate .ck{display:flex;gap:10px;align-items:flex-start;font-size:.78rem;line-height:1.5;color:#51605a;margin:0 0 10px}'+
   '#tvgate .ck input{margin-top:2px;width:18px;height:18px;flex-shrink:0;accent-color:#1fb599}'+
   '#tvgate .ck a{color:#0c1512;font-weight:600}'+
   '#tvgate button.go{width:100%;border:0;border-radius:100px;background:#2ce4ad;color:#06251b;font:inherit;font-weight:700;font-size:.95rem;padding:17px 20px;cursor:pointer;margin-top:8px}'+
   '#tvgate button.go[disabled]{opacity:.6;cursor:default}'+
   '#tvgate .ge{display:none;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:12px;padding:12px 14px;font-size:.82rem;line-height:1.5;margin:0 0 14px}'+
   '#tvgate .ge a{color:#b91c1c;font-weight:700}'+
   '#tvgate .gf{font-size:.76rem;color:#51605a;line-height:1.6;margin:14px 0 0;text-align:center}'+
   '#tvgate .gf a{color:#0c1512;font-weight:600}'+
   '#tvgate .gt{font-size:.74rem;color:#51605a;text-align:center;margin:12px 0 0}';
   document.head.appendChild(st)}
  const el=document.createElement('div');el.id='tvgate';el.setAttribute('data-tvpc-off','');
  el.innerHTML='<div class="gw"><div>'+
    '<div class="gk">Your health profile</div>'+
    '<h1 id="tvg-h">Your body map is ready.</h1>'+
    '<p class="gs">Built from your answers. Save it to your free account to see every system, the questions your blood needs to answer and the panel that fits you.</p>'+
    '<ul class="gl" id="tvg-l"></ul>'+
   '</div><div class="gc">'+
    '<h2>Save your map and see it in full</h2>'+
    '<p class="sub">Free, and no payment details. It stays in your account so you can come back to it.</p>'+
    '<div class="ge" id="tvg-e"></div>'+
    '<form id="tvg-f" novalidate>'+
    '<label class="f" for="tvg-n">First name</label><input class="t" id="tvg-n" type="text" autocomplete="given-name" maxlength="60">'+
    '<label class="f" for="tvg-m">Email</label><input class="t" id="tvg-m" type="email" autocomplete="email" inputmode="email" maxlength="120">'+
    '<label class="f" for="tvg-p">Choose a password</label><input class="t" id="tvg-p" type="password" autocomplete="new-password" minlength="8" placeholder="At least 8 characters">'+
    '<label class="ck"><input type="checkbox" id="tvg-c"><span>I have read and agree to the <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="/terms-of-use" target="_blank" rel="noopener">Terms of Use</a>.</span></label>'+
    '<label class="ck"><input type="checkbox" id="tvg-o"><span>Send me personalised health insights, offers and new panel launches. Unsubscribe at any time.</span></label>'+
    '<button class="go" id="tvg-b" type="submit">See my results</button>'+
    '</form>'+
    '<p class="gt">Rated Excellent on Trustpilot</p>'+
    '<p class="gf">Already have an account? <a href="/login">Log in</a>. Prefer the full sign-up form? <a href="/join?redirect=/dashboard">Use it here</a>.</p>'+
   '</div></div>';
  document.body.appendChild(el);window.scrollTo(0,0);
  const lock=['The questions your blood needs to answer','The markers no questionnaire can see','Which panel fits you, and why'].map(x=>'<li class="lock">'+x+'<span>In your full map</span></li>').join('');
  document.getElementById('tvg-l').innerHTML=lock;
  loadSummary(q).then(s=>{
    if(!s||!document.getElementById('tvg-h'))return;
    const p=s.prio.length,w=s.worth.length;
    document.getElementById('tvg-h').innerHTML=p?(p+' '+(p===1?'system needs':'systems need')+' a proper look.'+(w?'<br><em>'+w+' more worth checking.</em>':'')):(w?('Nothing urgent in your answers.<br><em>'+w+' '+(w===1?'area is':'areas are')+' worth checking.</em>'):'Your body map is ready.');
    const rows=s.prio.concat(s.worth).slice(0,4).map(x=>'<li>'+esc(x.n)+'<span style="color:'+esc(x.c)+'">'+esc(x.l)+'</span></li>').join('');
    document.getElementById('tvg-l').innerHTML=rows+lock;
  });
  const err=m=>{const e=document.getElementById('tvg-e');e.innerHTML=m;e.style.display=m?'block':'none';if(m)e.scrollIntoView({block:'center'})};
  let busy=false;
  document.getElementById('tvg-f').addEventListener('submit',function(ev){
    ev.preventDefault();if(busy)return;
    const name=document.getElementById('tvg-n').value.trim(),email=document.getElementById('tvg-m').value.trim(),pw=document.getElementById('tvg-p').value;
    if(!name){err('Please add your first name.');document.getElementById('tvg-n').focus();return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){err('Please enter a valid email address.');document.getElementById('tvg-m').focus();return}
    if(pw.length<8){err('Please choose a password of at least 8 characters.');document.getElementById('tvg-p').focus();return}
    if(!document.getElementById('tvg-c').checked){err('Please tick the box to accept the Privacy Policy and Terms of Use.');return}
    err('');busy=true;const btn=document.getElementById('tvg-b');btn.disabled=true;btn.textContent='Saving your map...';
    const fail=m=>{busy=false;btn.disabled=false;btn.textContent='See my results';err(m)};
    const data={email:email,password:pw,customFields:{'first-name':name,'dob':q.dob||'','gender':q.gender||'','marketing-opt-in':document.getElementById('tvg-o').checked,'quiz-data':quizJSON}};
    let tries=0;const t=setInterval(function(){
      if(!window.$memberstackDom){if(++tries>50){clearInterval(t);fail('We could not reach the sign-up service. <a href="/join?redirect=/dashboard">Use the full sign-up form</a>.')}return}
      clearInterval(t);
      Promise.resolve().then(()=>window.$memberstackDom.signupMemberEmailPassword(data)).then(function(){nav('/verification')}).catch(function(e){
        const m=((e&&e.message)||'').toLowerCase();
        if(m.includes('already exists')||m.includes('email is taken')||m.includes('duplicate')||m.includes('already taken'))fail('An account with this email already exists. <a href="/login?email='+encodeURIComponent(email)+'">Log in instead</a> and your map will be saved to it.');
        else if(m.includes('invalid email'))fail('Please enter a valid email address.');
        else if(m.includes('password'))fail('Please choose a longer password, at least 8 characters.');
        else if(m.includes('network')||m.includes('timeout')||m.includes('fetch'))fail('Connection problem. Please check your internet and try again.');
        else fail('Something went wrong saving your map. Please try again, or <a href="/join?redirect=/dashboard">use the full sign-up form</a>.');
      });
    },100);
  });
}

/* ---------- results ---------- */
/* purchase-aware framing: purchasers see "update your quiz" */
(function(fn){if(document.readyState==='complete')fn();else window.addEventListener('load',fn)})(function(){
  const t=setInterval(function(){ if(!window.$memberstackDom)return; clearInterval(t); p(); },100);
  function p(){
    window.$memberstackDom.getCurrentMember().then(function(r){
      const m=r&&r.data; if(!m||!m.id)return;
      // prefill from existing answers so a retake starts from where they were
      try{const raw=m.customFields&&m.customFields['quiz-data'];if(raw){const old=typeof raw==='string'?JSON.parse(raw):raw;for(const k in old){const v=old[k];if(typeof v==='string'&&v.indexOf(', ')>-1&&['symptoms','goals','habits','conditions','medications','supplements','familyHistory','hormonalMeds'].indexOf(k)>-1)A[k]=v.split(', ');else A[k]=v}
        // answers from before 6 Nov 2026 kept pregnancy inside hormonalMeds: move "trying to conceive" across and drop the
        // old "pregnant or breastfeeding" so the retake asks which one it is
        if(A.hormonalMeds&&A.hormonalMeds!=='__none'){const h=[].concat(A.hormonalMeds);if(h.indexOf('Trying to conceive')>-1&&!A.pregnancyStatus)A.pregnancyStatus='Trying to conceive';const k2=h.filter(x=>x!=='Trying to conceive'&&x!=='Pregnant or breastfeeding');A.hormonalMeds=k2.length?k2:undefined}}}catch(e){}
      const sub=document.getElementById('introSub');if(sub)sub.textContent='Your answers feed straight into your report. Keep them current, especially if your goals, symptoms, medication or lifestyle have changed.';
      const cta=document.getElementById('introCta');if(cta)cta.textContent='Update my answers';
      if(!window.__tvJourneyPromise){window.__tvJourneyPromise=fetch("https://truevitals-stripe-webhook.james-smillie-8c6.workers.dev/my-journey?email="+encodeURIComponent(m.auth.email)+"&member_id="+encodeURIComponent(m.id)).then(function(x){return x.json()}).then(function(d){return d&&!d.error?d:null}).catch(function(){return null})}
      window.__tvJourneyPromise.then(function(j){
        const purchased=!!(j&&(j.live_order||(j.reports&&j.reports.length)));
        const h=document.getElementById('introH1');
        if(purchased&&h){h.innerHTML='Keep your report about <em>the real you.</em>';const s=document.getElementById('introSample');if(s)s.style.display='none'}
      });
    }).catch(function(){});
  }
});

window.TVQuiz={start:startQuiz,go:go,skip:skipQ,render:render,U:U,clear:function(k){A[k]=undefined;render()}};
})();
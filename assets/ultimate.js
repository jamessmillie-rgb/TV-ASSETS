(function(){
  var D=[
    {g:"Overall Health",m:[
      {n:"TrueScore",a:"overall health score out of 100",u:1,c:1},{n:"PhenoAge",a:"biological age levine ageing",u:1,c:1},
      {n:"Cardiovascular Risk Score",a:"heart risk composite apob",u:1,c:1}
    ]},
    {g:"Blood Health",m:[
      {n:"Haemoglobin",a:"hb hgb anaemia anemia"},{n:"Haematocrit",a:"hct pcv"},{n:"Red Blood Cell Count",a:"rbc erythrocyte"},
      {n:"MCV",a:"mean cell volume"},{n:"MCH",a:"mean cell haemoglobin"},{n:"MCHC",a:"mean cell haemoglobin concentration"},
      {n:"RDW",a:"red cell distribution width"},{n:"Platelet Count",a:"plt thrombocyte"},{n:"MPV",a:"mean platelet volume"},
      {n:"White Blood Cell Count",a:"wbc leucocyte immune"},{n:"Neutrophil Count",a:"neutrophils"},
      {n:"Lymphocyte Count",a:"lymphocytes"},{n:"Monocyte Count",a:"monocytes"},{n:"Eosinophil Count",a:"eosinophils allergy"},
      {n:"Basophil Count",a:"basophils"},{n:"Reticulocyte Count",a:"retics"},{n:"Reticulocyte Absolute",a:"retics absolute"},
      {n:"ESR",a:"erythrocyte sedimentation rate inflammation",u:1},
      {n:"Mentzer Index",a:"thalassaemia iron deficiency microcytic",c:1},{n:"Reticulocyte Production Index",a:"rpi marrow response anaemia",u:1,c:1}
    ]},
    {g:"Heart & Cardiovascular",m:[
      {n:"Total Cholesterol",a:"lipids"},{n:"LDL Cholesterol",a:"bad cholesterol"},{n:"HDL Cholesterol",a:"good cholesterol"},
      {n:"Triglycerides",a:"trigs fats"},{n:"VLDL Cholesterol",a:"very low density lipoprotein",u:1,c:1},
      {n:"Cholesterol Ratio",a:"tc hdl ratio",c:1},{n:"HDL % of Total",a:"hdl percentage",u:1,c:1},
      {n:"Non-HDL Cholesterol",a:"non hdl",u:1,c:1},{n:"Apolipoprotein A-1",a:"apoa1 apo a"},
      {n:"Apolipoprotein B",a:"apob apo b"},{n:"Apolipoprotein B/A-1 Ratio",a:"apob apoa ratio",c:1},
      {n:"Lipoprotein(a)",a:"lpa lp a genetic cholesterol",u:1},{n:"Remnant Cholesterol",a:"remnants",u:1,c:1},
      {n:"Triglyceride/HDL Ratio",a:"trig hdl insulin resistance",u:1,c:1},{n:"Creatine Kinase",a:"ck muscle cardiac"},
      {n:"Lp(a)-Corrected LDL",a:"true ldl modifiable",u:1,c:1},{n:"Atherogenic Index of Plasma",a:"aip small dense ldl",c:1},
      {n:"LDL/HDL Ratio (Castelli II)",a:"castelli",c:1}
    ]},
    {g:"Inflammation",m:[
      {n:"High Sensitivity CRP (hs-CRP)",a:"crp c reactive protein inflammation",u:1},
            {n:"Neutrophil-to-Lymphocyte Ratio",a:"nlr immune inflammation",u:1,c:1},
      {n:"Platelet-to-Lymphocyte Ratio",a:"plr inflammation",c:1},{n:"Systemic Immune-Inflammation Index",a:"sii inflammation",c:1}
    ]},
    {g:"Liver Function",m:[
      {n:"Albumin",a:"alb protein"},{n:"ALT",a:"alanine transaminase liver enzyme"},{n:"Alkaline Phosphatase",a:"alp"},
      {n:"AST",a:"aspartate transaminase"},{n:"Gamma GT",a:"ggt gamma glutamyl alcohol"},{n:"Bilirubin",a:"jaundice gilberts"},
      {n:"Total Protein",a:"protein"},{n:"Globulin",a:"globulins",u:1,c:1},{n:"Albumin/Globulin Ratio",a:"a g ratio",u:1,c:1},
      {n:"FIB-4 Index",a:"liver fibrosis scarring score",u:1,c:1},{n:"APRI",a:"ast platelet ratio fibrosis",u:1,c:1},
      {n:"NAFLD Fibrosis Score",a:"fatty liver fibrosis",u:1,c:1},{n:"AST/ALT Ratio (De Ritis)",a:"de ritis alcohol",c:1}
    ]},
    {g:"Kidney & Electrolytes",m:[
      {n:"Sodium",a:"na electrolyte"},{n:"Potassium",a:"k electrolyte"},{n:"Chloride",a:"cl electrolyte"},
      {n:"Bicarbonate",a:"hco3 co2",u:1},{n:"Urea",a:"bun"},{n:"Creatinine",a:"kidney function"},
      {n:"eGFR",a:"gfr kidney filtration",c:1},{n:"Cystatin C",a:"kidney",u:1},{n:"Uric Acid",a:"gout urate"},
      {n:"Anion Gap",a:"acid base",u:1,c:1},
      {n:"eGFR (Cystatin C)",a:"kidney cystatin egfr",u:1,c:1},{n:"eGFR (Creatinine + Cystatin C)",a:"combined kidney egfr ckd-epi",u:1,c:1},
      {n:"Urea/Creatinine Ratio",a:"dehydration hydration",c:1},{n:"Calculated Serum Osmolality",a:"hydration osmolality",c:1},
      {n:"Albumin-Corrected Anion Gap",a:"acid base corrected",c:1},{n:"Glucose-Corrected Sodium",a:"sodium corrected",c:1}
    ]},
    {g:"Bone & Minerals",m:[
      {n:"Calcium",a:"ca bone"},{n:"Corrected Calcium",a:"adjusted calcium",u:1,c:1},
      {n:"Phosphate",a:"phosphorus"},{n:"Magnesium",a:"mg"}
    ]},
    {g:"Glucose & Metabolic",m:[
      {n:"Glucose",a:"blood sugar fasting diabetes"},{n:"HbA1c",a:"a1c average blood sugar diabetes"},
      {n:"Insulin",a:"fasting insulin",u:1},{n:"C-Peptide",a:"c peptide",u:1},
      {n:"HOMA-IR",a:"insulin resistance",u:1,c:1},{n:"HOMA-B",a:"beta cell function",u:1,c:1},
      {n:"TyG Index",a:"triglyceride glucose insulin resistance",u:1,c:1},{n:"Estimated Average Glucose",a:"eag average blood sugar",c:1}
    ]},
    {g:"Thyroid & Parathyroid",m:[
      {n:"TSH",a:"thyroid stimulating hormone"},{n:"Free T4 (FT4)",a:"thyroxine thyroid"},
      {n:"Free T3 (FT3)",a:"triiodothyronine thyroid"},
      {n:"Thyroid Peroxidase Antibodies",a:"tpo hashimotos autoimmune thyroid",u:1},
      {n:"Thyroglobulin Antibody",a:"tg antibody thyroid autoimmune",u:1},{n:"Parathyroid Hormone",a:"pth calcium",u:1},
      {n:"FT3/FT4 Ratio",a:"thyroid conversion",c:1}
    ]},
    {g:"Complete Hormones",m:[
      {n:"Testosterone",a:"test trt androgen"},{n:"Free Androgen Index",a:"fai free testosterone",c:1},
      {n:"Sex Hormone Binding Globulin",a:"shbg"},{n:"Luteinising Hormone",a:"lh"},
      {n:"Follicle Stimulating Hormone",a:"fsh fertility menopause",u:1},{n:"Prolactin",a:"prl",u:1},
      {n:"Cortisol",a:"stress adrenal"},{n:"DHEA-S",a:"dhea adrenal"},
      {n:"Oestradiol",a:"estradiol e2 oestrogen estrogen hrt",u:1},{n:"Progesterone",a:"ovulation hrt",u:1},
      {n:"Calculated Free Testosterone",a:"vermeulen free testosterone",c:1},{n:"Bioavailable Testosterone",a:"bioavailable free testosterone",c:1},
      {n:"Free Oestradiol Index",a:"free estradiol shbg",u:1,c:1}
    ]},
    {g:"Iron, Vitamins & Antioxidants",m:[
      {n:"Iron",a:"serum iron"},{n:"Ferritin",a:"iron stores fatigue"},{n:"Total Iron Binding Capacity",a:"tibc"},
      {n:"Transferrin Saturation",a:"tsat iron saturation",c:1},{n:"Transferrin",a:"iron transport"},
      {n:"Vitamin D",a:"vit d 25 oh vitd"},{n:"Vitamin B12",a:"b12 cobalamin"},{n:"Folate",a:"folic acid b9"},
      {n:"Total Antioxidant Status",a:"tas taa antioxidants oxidative"}
    ]},
    {g:"Tumour Markers",m:[
      {n:"Carcinoembryonic Antigen (CEA)",a:"cea bowel colorectal cancer",u:1},
      {n:"Cancer Antigen 19-9 (CA 19-9)",a:"ca19 9 pancreatic cancer",u:1},
      {n:"PSA Total",a:"prostate specific antigen cancer",u:1,s:"M"},
      {n:"PSA Free",a:"free prostate specific antigen",u:1,s:"M"},
      {n:"PSA Ratio",a:"psa free ratio prostate",u:1,s:"M",c:1},
      {n:"CA-125",a:"ca125 ovarian cancer",u:1,s:"F"},
      {n:"CA 15-3",a:"ca15 3 breast cancer",u:1,s:"F"}
    ]},
    {g:"Immunoglobulins & Autoimmune",m:[
      {n:"Immunoglobulin G (IgG)",a:"igg antibody immune",u:1},{n:"Immunoglobulin M (IgM)",a:"igm antibody",u:1},
      {n:"Immunoglobulin A (IgA)",a:"iga antibody mucosal",u:1},{n:"Immunoglobulin E (IgE)",a:"ige allergy allergies",u:1},
      {n:"Rheumatoid Factor",a:"rf arthritis autoimmune",u:1}
    ]},
    {g:"Gastrointestinal & Coeliac",m:[
      {n:"Amylase",a:"pancreas digestive",u:1},{n:"Lipase",a:"pancreas digestive",u:1},
      {n:"Anti-Tissue Transglutaminase (Anti-tTG)",a:"ttg coeliac celiac gluten",u:1}
    ]},
    {g:"Advanced Urinalysis",m:[
      {n:"pH (Urine)",a:"acidity"},{n:"Protein (Urine)",a:"proteinuria kidney"},
      {n:"Glucose (Urine)",a:"glycosuria",u:1},{n:"Ketones (Urine)",a:"keto ketosis"},
      {n:"Specific Gravity",a:"hydration concentration",u:1},{n:"Urobilinogen",a:"liver bilirubin",u:1},
      {n:"Casts",a:"kidney tubules",u:1},{n:"White Blood Cells (Urine)",a:"wbc uti infection",u:1},
      {n:"Red Blood Cells (Urine)",a:"rbc blood haematuria",u:1},{n:"Nitrite",a:"uti bacteria infection"},
      {n:"Bacterial Count",a:"uti bacteria infection",u:1},{n:"Culture & Sensitivities",a:"uti antibiotic culture",u:1}
    ]}
  ];

  var acc=document.getElementById('tuAcc'),input=document.getElementById('tuSearch'),
      clear=document.getElementById('tuClear'),toggle=document.getElementById('tuToggle'),
      noRes=document.getElementById('tuNoRes'),countEl=document.getElementById('tuCount');
  if(!acc||!input) return;

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function rx(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}

  var isMobile=window.matchMedia?window.matchMedia('(max-width:767px)').matches:window.innerWidth<768;

  D.forEach(function(sec,si){
    var item=document.createElement('div');
    item.className='tu-acc-item'+(isMobile?(si===0?' open':''):' open');

    var btn=document.createElement('button');
    btn.type='button';btn.className='tu-acc-btn';
    btn.setAttribute('aria-expanded',item.classList.contains('open')?'true':'false');
    btn.innerHTML='<span class="acc-icon"><svg><use href="#u-plus"></use></svg></span>'+
      '<span>'+esc(sec.g)+'</span>'+
      '<span class="acc-count"><span class="acc-n">'+sec.m.length+'</span> markers</span>';
    btn.addEventListener('click',function(){
      var o=item.classList.toggle('open');
      btn.setAttribute('aria-expanded',o?'true':'false');
    });

    var body=document.createElement('div');body.className='tu-acc-body';
    var ul=document.createElement('ul');ul.className='tu-mk';

    sec.m.forEach(function(mk){
      var li=document.createElement('li');
      if(mk.u) li.className='nm';
      li.setAttribute('data-t',(mk.n+' '+(mk.a||'')+' '+sec.g).toLowerCase());
      li.setAttribute('data-n',mk.n);
      var tags='';
      if(mk.s) tags+='<span class="tu-mt tu-mt-'+(mk.s==='M'?'m">Men':'f">Women')+'</span>';
      if(mk.c) tags+='<span class="tu-mt tu-mt-c">Calc</span>';
      li.innerHTML='<span class="mk-n">'+esc(mk.n)+'</span>'+tags;
      ul.appendChild(li);
    });

    body.appendChild(ul);item.appendChild(btn);item.appendChild(body);acc.appendChild(item);
  });

  var items=[].slice.call(acc.querySelectorAll('.tu-acc-item'));

  function run(q){
    q=(q||'').toLowerCase().trim();
    clear.classList.toggle('on',q.length>0);
    var total=0;

    items.forEach(function(item,i){
      var lis=[].slice.call(item.querySelectorAll('.tu-mk li')),shown=0;
      lis.forEach(function(li){
        var hit=!q||li.getAttribute('data-t').indexOf(q)>-1;
        li.classList.toggle('hide',!hit);
        var nameEl=li.querySelector('.mk-n'),raw=li.getAttribute('data-n');
        if(hit&&q){
          nameEl.innerHTML=esc(raw).replace(new RegExp('('+rx(q)+')','ig'),'<mark>$1</mark>');
        }else{
          nameEl.textContent=raw;
        }
        if(hit) shown++;
      });
      total+=shown;
      item.classList.toggle('hide',shown===0);
      var n=item.querySelector('.acc-n');
      if(n) n.textContent=q?shown:D[i].m.length;
      if(q&&shown>0){
        item.classList.add('open');
        item.querySelector('.tu-acc-btn').setAttribute('aria-expanded','true');
      }
    });

    if(q){
      countEl.innerHTML='<b>'+total+'</b> matching biomarker'+(total===1?'':'s');
      noRes.classList.toggle('on',total===0);
      if(total===0){
        noRes.textContent='No biomarker matches "'+q+'" on the Ultimate Panel. Try a shorter term, or email support@truevitals.co.uk and we will check for you.';
      }
    }else{
      countEl.innerHTML='<b>140</b> biomarkers for men · <b>139</b> for women';
      noRes.classList.remove('on');
    }
  }

  var t;
  input.addEventListener('input',function(){
    var v=this.value;clearTimeout(t);
    t=setTimeout(function(){run(v)},90);
  });

  clear.addEventListener('click',function(){input.value='';run('');input.focus()});

  toggle.addEventListener('click',function(){
    var anyClosed=items.some(function(i){return !i.classList.contains('open')&&!i.classList.contains('hide')});
    items.forEach(function(i){
      i.classList.toggle('open',anyClosed);
      i.querySelector('.tu-acc-btn').setAttribute('aria-expanded',anyClosed?'true':'false');
    });
    toggle.textContent=anyClosed?'Collapse all':'Expand all';
  });

  toggle.textContent=isMobile?'Expand all':'Collapse all';
})();

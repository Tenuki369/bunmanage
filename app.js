'use strict';

const productData={
  capital:{
    label:'Money Room',
    mode:'Capital mode',
    brief:'Capital Ledger Pilot',
    metrics:['42','Open approvals','$1.8M','Pending settlement','0','Unmatched exports'],
    records:[
      ['Vendor payout approval','Docs verified - waiting on controller','Approval','High'],
      ['Client invoice reconciliation','Three payments matched to ledger entries','Matched','Ready'],
      ['Entity transfer review','Banking reference attached for audit','Review','Today']
    ]
  },
  logistics:{
    label:'Move Room',
    mode:'Freight mode',
    brief:'Logistics Control Pilot',
    metrics:['18','Active exceptions','96.4%','Target lane compliance','7','Carrier scorecards due'],
    records:[
      ['Load BM-2841 exception','Late document uploaded by carrier','Exception','Owner set'],
      ['Lane margin review','Fuel variance attached to settlement','Margin','Review'],
      ['Asset status update','Delivery event ready for billing trigger','Closed','Ready']
    ]
  },
  specialist:{
    label:'Make Room',
    mode:'Specialist mode',
    brief:'Specialist Work Pilot',
    metrics:['11','Milestones in review','$420K','Payouts gated','5','Client approvals needed'],
    records:[
      ['Advisory milestone approval','Evidence packet attached for client review','Milestone','Review'],
      ['Escrow release condition','Scope completion awaiting second approval','Payout','Blocked'],
      ['Specialist onboarding','W-9 and contract records synced','Complete','Ready']
    ]
  }
};

function dollars(value){return value>=100?'$100M+':'$'+value+'M'}
function tierFor(verticals,volume){
  if(verticals>=3 || volume>50)return {name:'Atlas',price:'$1,999',standard:'$2,499',note:'Atlas fits all three proof rooms or routed volume above $50M, with rollout planning and dedicated implementation support.'};
  if(verticals>=2 || volume>5)return {name:'Growth',price:'$999',standard:'$1,249',note:'Growth fits two active rooms or routed volume above $5M, with cross-room receipts and priority room mapping.'};
  return {name:'Starter',price:'$399',standard:'$499',note:'Starter fits one proof room and up to $5M in routed monthly volume.'};
}
function setText(id,value){const node=document.getElementById(id);if(node)node.textContent=value}
function selectedSubsystems(){
  return [...document.querySelectorAll('input[name="subsystem"]')].filter(input=>input.checked).map(input=>input.value);
}
function renderWorkspace(product){
  const data=productData[product] || productData.capital;
  setText('modeChip',data.mode);
  setText('workspaceMetricOne',data.metrics[0]);setText('workspaceMetricOneLabel',data.metrics[1]);
  setText('workspaceMetricTwo',data.metrics[2]);setText('workspaceMetricTwoLabel',data.metrics[3]);
  setText('workspaceMetricThree',data.metrics[4]);setText('workspaceMetricThreeLabel',data.metrics[5]);
  const records=document.getElementById('records');
  if(records){
    records.innerHTML=data.records.map(row=>'<div class="record"><div><strong>'+row[0]+'</strong><small>'+row[1]+'</small></div><span class="pill">'+row[2]+'</span><span class="pill">'+row[3]+'</span></div>').join('');
  }
}
function syncPricing(verticals,volume){
  const tier=tierFor(verticals,volume);
  setText('priceVerticalsValue',String(verticals));
  setText('priceVolumeValue',dollars(volume));
  setText('tierName',tier.name);
  setText('tierPrice',tier.price);
  setText('tierStandard',tier.standard);
  setText('tierNote',tier.note);
  const one=document.getElementById('unlockOne');
  const two=document.getElementById('unlockTwo');
  const three=document.getElementById('unlockThree');
  if(one)one.classList.toggle('active',verticals>=1);
  if(two)two.classList.toggle('active',verticals>=2 || volume>5);
  if(three)three.classList.toggle('active',verticals>=3 || volume>50);
}
function updatePricing(){
  const priceVerticals=document.getElementById('priceVerticals');
  const priceVolume=document.getElementById('priceVolume');
  if(!priceVerticals || !priceVolume)return;
  syncPricing(Number(priceVerticals.value),Number(priceVolume.value));
}
function updateIntake(){
  const intakePersona=document.getElementById('intakePersona');
  const volumeRange=document.getElementById('volumeRange');
  const currentStack=document.getElementById('currentStack');
  if(!intakePersona || !volumeRange || !currentStack)return;
  const persona=intakePersona.value;
  const subs=selectedSubsystems();
  const verticalCount=Math.max(1,subs.length);
  const volume=Number(volumeRange.value);
  const tier=tierFor(verticalCount,volume);
  setText('volumeValue',dollars(volume));
  setText('briefTitle',(productData[persona] || productData.capital).brief);
  setText('briefTier',tier.name+' fit');
  const briefList=document.getElementById('briefList');
  if(briefList){
    briefList.innerHTML=[
      'First proof room: '+(productData[persona] || productData.capital).label,
      'Rooms sharing receipts: '+subs.map(s=>(productData[s] || productData.capital).label).join(', '),
      'Monthly routed volume: '+dollars(volume),
      'Current system: '+currentStack.value,
      'Recommended tier: '+tier.name+' at '+tier.price+' / mo launch'
    ].map(item=>'<li>'+item+'</li>').join('');
  }
  const priceVerticals=document.getElementById('priceVerticals');
  const priceVolume=document.getElementById('priceVolume');
  if(priceVerticals && priceVolume){
    priceVerticals.value=String(verticalCount);
    priceVolume.value=String(volume);
    updatePricing();
  }
}
function initIntakeFromQuery(){
  const intakePersona=document.getElementById('intakePersona');
  if(!intakePersona)return;
  const params=new URLSearchParams(window.location.search);
  const product=params.get('product');
  if(productData[product]){
    intakePersona.value=product;
    document.querySelectorAll('input[name="subsystem"]').forEach(input=>{input.checked=input.value===product});
  }
}
function prepareBrief(){
  const intakePersona=document.getElementById('intakePersona');
  const volumeRange=document.getElementById('volumeRange');
  const currentStack=document.getElementById('currentStack');
  const email=document.getElementById('email');
  if(!intakePersona || !volumeRange || !currentStack)return;
  const subs=selectedSubsystems();
  const volume=Number(volumeRange.value);
  const tier=tierFor(Math.max(1,subs.length),volume);
  const body=[
    'Hi BunManage team,',
    '',
    'I built a BunManage access brief from the public intake.',
    '',
    'Email: '+(email ? email.value : ''),
    'First proof room: '+(productData[intakePersona.value] || productData.capital).label,
    'Rooms sharing receipts: '+subs.map(s=>(productData[s] || productData.capital).label).join(', '),
    'Monthly routed volume: '+dollars(volume),
    'Current system: '+currentStack.value,
    'Recommended tier: '+tier.name+' at '+tier.price+' / mo launch',
    '',
    'Please follow up with founding customer access.'
  ].join('\n');
  setText('briefStatus','Access brief prepared. Email opens with the room, volume, and proof requirements included.');
  window.location.href='mailto:hello@bunmanage.com?subject='+encodeURIComponent('Early Access Configuration - BunManage')+'&body='+encodeURIComponent(body);
}
function init(){
  document.querySelectorAll('[data-workspace-product]').forEach(button=>{
    button.addEventListener('click',()=>{
      document.querySelectorAll('[data-workspace-product]').forEach(item=>item.classList.toggle('active',item===button));
      renderWorkspace(button.dataset.workspaceProduct);
    });
  });
  document.querySelectorAll('input[name="subsystem"]').forEach(input=>{
    input.addEventListener('change',()=>{
      if(selectedSubsystems().length===0)input.checked=true;
      updateIntake();
    });
  });
  const intakePersona=document.getElementById('intakePersona');
  if(intakePersona)intakePersona.addEventListener('change',updateIntake);
  const volumeRange=document.getElementById('volumeRange');
  if(volumeRange)volumeRange.addEventListener('input',updateIntake);
  const currentStack=document.getElementById('currentStack');
  if(currentStack)currentStack.addEventListener('change',updateIntake);
  const priceVerticals=document.getElementById('priceVerticals');
  if(priceVerticals)priceVerticals.addEventListener('input',updatePricing);
  const priceVolume=document.getElementById('priceVolume');
  if(priceVolume)priceVolume.addEventListener('input',updatePricing);
  const prepare=document.getElementById('prepareBrief');
  if(prepare)prepare.addEventListener('click',prepareBrief);
  initIntakeFromQuery();
  renderWorkspace(document.body.dataset.product || 'capital');
  updateIntake();
  updatePricing();
}
document.addEventListener('DOMContentLoaded',init);

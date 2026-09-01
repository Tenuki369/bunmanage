'use strict';

const productData={
  capital:{
    label:'Money Room',
    mode:'Capital mode',
    brief:'Capital Ledger Pilot',
    heroTitle:'Money has to explain itself.',
    heroCopy:'Start with the Money Room when approvals, settlement, reconciliation, and close evidence are the daily drag. BunManage turns each money movement into a receipt chain.',
    heroMetrics:['42','Approval records waiting for owner action','$1.8M','Settlement value held behind proof','0','Target unmatched exports after rollout'],
    metrics:['42','Open approvals','$1.8M','Pending settlement','0','Unmatched exports'],
    records:[
      {title:'Vendor payout approval',body:'Docs verified. Waiting on controller approval before release.',status:'Approval',risk:'High',owner:'Controller',receipt:'policy_check.passed',next:'Approve or return for more evidence',desk:'Approval Desk'},
      {title:'Client invoice reconciliation',body:'Three payments matched to ledger entries and ready for close export.',status:'Matched',risk:'Ready',owner:'Finance Ops',receipt:'match_state.ready',next:'Include in close packet',desk:'Match Drawer'},
      {title:'Entity transfer review',body:'Banking reference attached and counterparty evidence retained for audit.',status:'Review',risk:'Today',owner:'Treasury',receipt:'entity_transfer.review',next:'Second approval required',desk:'Close Packet'}
    ]
  },
  logistics:{
    label:'Move Room',
    mode:'Freight mode',
    brief:'Logistics Control Pilot',
    heroTitle:'Freight has to become billable.',
    heroCopy:'Start with the Move Room when dispatch truth and invoice truth keep separating. BunManage keeps load state, carrier proof, exception owner, and settlement handoff in one receipt chain.',
    heroMetrics:['18','Load exceptions with named owners','96.4%','Target lane compliance after proof capture','<24h','Exception review target for pilot lanes'],
    metrics:['18','Active exceptions','96.4%','Target lane compliance','7','Carrier scorecards due'],
    records:[
      {title:'Load BM-2841 exception',body:'Late document uploaded by carrier and assigned before billing handoff.',status:'Exception',risk:'Owner',owner:'Dispatch Lead',receipt:'load_receipt.exception',next:'Confirm POD and release billing packet',desk:'Exception Desk'},
      {title:'Lane margin review',body:'Fuel variance and accessorial note attached to settlement context.',status:'Margin',risk:'Review',owner:'Lane Manager',receipt:'margin_signal.attached',next:'Approve margin adjustment',desk:'Carrier Receipt'},
      {title:'Asset status update',body:'Delivery event confirmed and ready to become invoice context.',status:'Closed',risk:'Ready',owner:'Billing Ops',receipt:'load_receipt.ready',next:'Send to settlement packet',desk:'Settlement Packet'}
    ]
  },
  specialist:{
    label:'Make Room',
    mode:'Specialist mode',
    brief:'Specialist Work Pilot',
    heroTitle:'Done has to prove itself.',
    heroCopy:'Start with the Make Room when scope, acceptance, and payout live in different stories. BunManage binds milestone evidence to client decision and release gates.',
    heroMetrics:['11','Milestones waiting on client decision','$420K','Payout value gated behind acceptance','5','Proof packets needing review'],
    metrics:['11','Milestones in review','$420K','Payouts gated','5','Client approvals needed'],
    records:[
      {title:'Advisory milestone approval',body:'Evidence packet attached and client review state captured.',status:'Milestone',risk:'Review',owner:'Client Sponsor',receipt:'milestone_evidence.sent',next:'Accept or request revision',desk:'Evidence Room'},
      {title:'Escrow release condition',body:'Scope completion awaiting second approval before funds can release.',status:'Payout',risk:'Blocked',owner:'Engagement Lead',receipt:'release_gate.blocked',next:'Resolve missing approval',desk:'Release Gate'},
      {title:'Specialist onboarding',body:'W-9 and contract records synced to engagement receipt.',status:'Complete',risk:'Ready',owner:'Ops Admin',receipt:'specialist.ready',next:'Open milestone room',desk:'Client Record'}
    ]
  },
  control:{
    label:'Risk Rail',
    mode:'Control mode',
    brief:'Control Review',
    heroTitle:'Risk needs one place to land.',
    heroCopy:'Use the Risk Rail when exceptions, missing proof, and policy breaks cut across rooms. BunManage turns loose operational risk into named work.',
    heroMetrics:['7','Cross-room exceptions open','3','Release gates blocked','100%','Receipts keep owner and source proof'],
    metrics:['7','Open control issues','3','Blocked releases','100%','Owner assignment target'],
    records:[
      {title:'Missing proof sweep',body:'Records with release pressure but incomplete source evidence.',status:'Review',risk:'High',owner:'Control Lead',receipt:'control_sweep.open',next:'Collect proof or block release',desk:'Risk Rail'},
      {title:'Duplicate reference alert',body:'Potential reused bank reference found across two payout requests.',status:'Exception',risk:'High',owner:'Controller',receipt:'duplicate_ref.flagged',next:'Verify counterparty and account',desk:'Policy Watch'},
      {title:'Aging exception queue',body:'Freight and capital records over target review window.',status:'Review',risk:'Owner',owner:'Ops Lead',receipt:'aging_queue.ready',next:'Assign room owners',desk:'Exception Aging'}
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
function statusClass(value){return 'status-'+String(value || '').toLowerCase().replace(/[^a-z0-9]+/g,'-')}
function selectedSubsystems(){
  return [...document.querySelectorAll('input[name="subsystem"]')].filter(input=>input.checked).map(input=>input.value);
}
function renderDrawer(record){
  if(!record)return;
  setText('drawerLabel',record.desk);
  setText('drawerTitle',record.title);
  setText('drawerBody',record.body);
  setText('drawerOwner',record.owner);
  setText('drawerReceipt',record.receipt);
  setText('drawerNext',record.next);
}
function renderWorkspace(product){
  const data=productData[product] || productData.capital;
  setText('modeChip',data.mode);
  setText('workspaceMetricOne',data.metrics[0]);setText('workspaceMetricOneLabel',data.metrics[1]);
  setText('workspaceMetricTwo',data.metrics[2]);setText('workspaceMetricTwoLabel',data.metrics[3]);
  setText('workspaceMetricThree',data.metrics[4]);setText('workspaceMetricThreeLabel',data.metrics[5]);
  const records=document.getElementById('records');
  if(records){
    records.innerHTML=data.records.map((row,index)=>'<button class="record'+(index===0?' active':'')+'" type="button" data-record-index="'+index+'"><div><strong>'+row.title+'</strong><small>'+row.body+'</small></div><span class="status-badge '+statusClass(row.status)+'">'+row.status+'</span><span class="status-badge '+statusClass(row.risk)+'">'+row.risk+'</span></button>').join('');
    records.querySelectorAll('.record').forEach(button=>{
      button.addEventListener('click',()=>{
        records.querySelectorAll('.record').forEach(item=>item.classList.toggle('active',item===button));
        renderDrawer(data.records[Number(button.dataset.recordIndex)]);
      });
    });
    renderDrawer(data.records[0]);
  }
}
function setDomain(product){
  const data=productData[product] || productData.capital;
  setText('heroTitle',data.heroTitle);
  setText('heroCopy',data.heroCopy);
  setText('heroMetricOne',data.heroMetrics[0]);setText('heroMetricOneLabel',data.heroMetrics[1]);
  setText('heroMetricTwo',data.heroMetrics[2]);setText('heroMetricTwoLabel',data.heroMetrics[3]);
  setText('heroMetricThree',data.heroMetrics[4]);setText('heroMetricThreeLabel',data.heroMetrics[5]);
  document.querySelectorAll('[data-domain-switch]').forEach(button=>button.classList.toggle('active',button.dataset.domainSwitch===product));
  document.querySelectorAll('[data-room-card]').forEach(card=>card.classList.toggle('active',card.dataset.roomCard===product));
  document.querySelectorAll('[data-plane]').forEach(plane=>plane.classList.toggle('active',plane.dataset.plane===product));
  document.querySelectorAll('[data-workspace-product]').forEach(button=>button.classList.toggle('active',button.dataset.workspaceProduct===product));
  const intakePersona=document.getElementById('intakePersona');
  if(intakePersona && product !== 'control')intakePersona.value=product;
  renderWorkspace(product);
  updateIntake();
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
  document.querySelectorAll('[data-domain-switch]').forEach(button=>{
    button.addEventListener('click',()=>setDomain(button.dataset.domainSwitch));
  });
  document.querySelectorAll('[data-workspace-product]').forEach(button=>{
    button.addEventListener('click',()=>{
      const product=button.dataset.workspaceProduct;
      if(productData[product])setDomain(product);
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
  const startingProduct=document.body.dataset.product || 'capital';
  if(document.querySelector('[data-domain-switch]'))setDomain(startingProduct);
  else renderWorkspace(startingProduct);
  updateIntake();
  updatePricing();
}
document.addEventListener('DOMContentLoaded',init);

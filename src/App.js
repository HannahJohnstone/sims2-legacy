/* eslint-disable no-restricted-globals */
import { useState, useEffect, useRef } from "react";

const ASPIRATIONS = ["Popularity","Romance","Family","Fortune","Knowledge","Pleasure","Grilled Cheese"];
const MOODS = ["Platinum","Green","Slightly Uncomfortable","Miserable","Aspiration Failed"];
const AGE_STAGES = ["Baby","Toddler","Child","Teen","Young Adult","Adult","Elder","Deceased"];
const CAREERS = ["Unemployed","Undecided","Culinary","Military","Slacker","Business","Crime","Intelligence","Law Enforcement","Medicine","Science","Politics","Entertainment","Athletics","Education","Paranormal","Adventurer","Artist","Dance","Journalism","Music","Natural Science","Philosophy","Show Business","Socialite","Vet"];
const GEN_COLORS = ["#7F77DD","#1D9E75","#D85A30","#D4537E","#378ADD","#BA7517","#639922","#E24B4A"];
const REL_TYPES = ["Husband","Wife","Partner","Ex","Parent","Child","Sibling","Best Friend","Friend","Enemy","Rival","Neighbour","Boss","Coworker","Crush","Estranged"];
const TRAITS = [
  {key:"neat",label:"Neat / Sloppy",left:"Sloppy",right:"Neat"},
  {key:"outgoing",label:"Shy / Outgoing",left:"Shy",right:"Outgoing"},
  {key:"active",label:"Lazy / Active",left:"Lazy",right:"Active"},
  {key:"playful",label:"Serious / Playful",left:"Serious",right:"Playful"},
  {key:"nice",label:"Grouchy / Nice",left:"Grouchy",right:"Nice"},
];
const WANT_SUGGESTIONS = ["Become a werewolf","Become a vampire","Become a plantsim","Become a witch","Get married","Have a baby","Get engaged","Fall in love","Reach top of career","Get promoted","Earn §100,000","Make a best friend","Woohoo","Skill up cooking","Skill up logic","Buy something","Throw a party","Reach platinum mood","Graduate from university","Go on a date","Adopt a pet"];
const FEAR_SUGGESTIONS = ["Die","Get fired","Relative dies","Break up","Get demoted","Become a zombie","Burglary","House fire","Failing exam","Electrocution","Drowning","Satellite crash","Cockroach infestation","Having a bad date","Social bunny visit","Aspiration failure"];

const THEME = {
  bg: "#E8DCC8",
  panel: "#2C2118",
  panelAlt: "#3A2D20",
  border: "#5C4A32",
  borderLight: "#7A6245",
  text: "#F5EDD8",
  textMuted: "#B8A080",
  gold: "#C9923A",
  goldLight: "#E8B05A",
  brown: "#8B6340",
  danger: "#C0503A",
};

const fs = {
  field:{width:"100%",boxSizing:"border-box",padding:"8px 10px",fontSize:"14px",borderRadius:"8px",border:`1px solid ${THEME.border}`,background:THEME.panelAlt,color:THEME.text,marginTop:"4px"},
  label:{fontSize:"12px",color:THEME.textMuted,fontWeight:600,display:"block",marginBottom:"2px",textTransform:"uppercase",letterSpacing:"0.05em"},
  card:{background:THEME.panel,border:`1px solid ${THEME.border}`,borderRadius:"12px",padding:"1rem 1.25rem",marginBottom:"10px"},
};
const defaultTraits={neat:5,outgoing:5,active:5,playful:5,nice:5};
const defaultForm={name:"",age:"",aspiration:"",career:"",careerLevel:"1",relationships:[],situation:"",recentEvents:"",mood:"",generation:"1",role:"",wants:[],fears:[]};
const ACTION_ICONS={task:"🔨",relationship:"💞",challenge:"⚔️",fate:"🎲"};

function WantsFearInput({label,color,items,onChange,suggestions}){
  const [text,setText]=useState("");const [showSug,setShowSug]=useState(false);
  const filtered=suggestions.filter(s=>s.toLowerCase().includes(text.toLowerCase())&&text.length>0&&!items.includes(s));
  const add=(val)=>{const v=(val||text).trim();if(!v||items.includes(v))return;onChange([...items,v]);setText("");setShowSug(false);};
  const remove=(i)=>onChange(items.filter((_,idx)=>idx!==i));
  return(
    <div style={{flex:1}}>
      <label style={{...fs.label,color}}>{label}</label>
      <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"6px",minHeight:"24px"}}>
        {items.length===0&&<span style={{fontSize:"12px",color:THEME.text}}>None yet.</span>}
        {items.map((it,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:"3px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"3px 8px",fontSize:"12px",border:`0.5px solid ${color}44`}}>
            <span style={{color:THEME.text}}>{it}</span>
            <button onClick={()=>remove(i)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-secondary)",fontSize:"12px",padding:"0 0 0 3px",lineHeight:1}}>×</button>
          </div>
        ))}
      </div>
      <div style={{position:"relative"}}>
        <div style={{display:"flex",gap:"6px"}}>
          <input style={{...fs.field,marginTop:0,flex:1}} placeholder={`Add ${label.toLowerCase()}...`} value={text} onChange={e=>{setText(e.target.value);setShowSug(true);}} onFocus={()=>setShowSug(true)} onBlur={()=>setTimeout(()=>setShowSug(false),150)} onKeyDown={e=>e.key==="Enter"&&add()}/>
          <button onClick={()=>add()} style={{padding:"6px 10px",fontSize:"13px",borderRadius:"var(--border-radius-md)",cursor:"pointer",whiteSpace:"nowrap",borderColor:color,color}}>+</button>
        </div>
        {showSug&&filtered.length>0&&(
          <div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",zIndex:50,marginTop:"2px",overflow:"hidden",maxHeight:"160px",overflowY:"auto"}}>
            {filtered.map(s=><div key={s} onMouseDown={()=>add(s)} style={{padding:"7px 10px",fontSize:"13px",cursor:"pointer",color:"var(--color-text-primary)"}} onMouseEnter={e=>e.currentTarget.style.background="var(--color-background-secondary)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{s}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

function WantsFearBadges({wants,fears}){
  if(!wants?.length&&!fears?.length) return null;
  return(
    <div style={{marginTop:"8px"}}>
      {wants?.length>0&&<div style={{marginBottom:"4px"}}><span style={{fontSize:"10px",fontWeight:600,color:"#1D9E75",marginRight:"6px"}}>WANTS</span>{wants.map((w,i)=><span key={i} style={{fontSize:"11px",background:"#1D9E7511",border:"0.5px solid #1D9E7544",borderRadius:"var(--border-radius-md)",padding:"2px 7px",marginRight:"4px",color:"var(--color-text-primary)"}}>{w}</span>)}</div>}
      {fears?.length>0&&<div><span style={{fontSize:"10px",fontWeight:600,color:"#D85A30",marginRight:"6px"}}>FEARS</span>{fears.map((f,i)=><span key={i} style={{fontSize:"11px",background:"#D85A3011",border:"0.5px solid #D85A3044",borderRadius:"var(--border-radius-md)",padding:"2px 7px",marginRight:"4px",color:"var(--color-text-primary)"}}>{f}</span>)}</div>}
    </div>
  );
}

function TraitSliders({traits,onChange}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
      {TRAITS.map(t=>(
        <div key={t.key}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
            <span style={{fontSize:"11px",color:THEME.text}}>{t.left}</span>
            <span style={{fontSize:"11px",fontWeight:500,color:THEME.textMuted}}>{t.label}</span>
            <span style={{fontSize:"11px",color:THEME.text}}>{t.right}</span>
          </div>
          <input type="range" min="1" max="10" step="1" value={traits[t.key]} onChange={e=>onChange(t.key,parseInt(e.target.value))} style={{width:"100%"}}/>
        </div>
      ))}
    </div>
  );
}

function RelationshipInput({relationships,onChange,members,currentName}){
  const [name,setName]=useState("");const [type,setType]=useState(REL_TYPES[0]);const [showSugg,setShowSugg]=useState(false);
  const sugg=members.map(m=>m.name).filter(n=>n!==currentName&&n.toLowerCase().includes(name.toLowerCase())&&name.length>0);
  const add=()=>{if(!name.trim())return;onChange([...relationships,{name:name.trim(),type}]);setName("");setType(REL_TYPES[0]);setShowSugg(false);};
  const remove=(i)=>onChange(relationships.filter((_,idx)=>idx!==i));
  return(
    <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"8px",minHeight:"28px"}}>
        {relationships.length===0&&<span style={{fontSize:"12px",color:"var(--color-text-secondary)"}}>None yet.</span>}
        {relationships.map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:"4px",background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"4px 8px",fontSize:"12px"}}>
            <span style={{fontWeight:500,color:"var(--color-text-primary)"}}>{r.name}</span><span style={{color:"var(--color-text-secondary)"}}>· {r.type}</span>
            <button onClick={()=>remove(i)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-secondary)",fontSize:"13px",lineHeight:1,padding:"0 0 0 4px"}}>×</button>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"6px"}}>
        <div style={{flex:2,position:"relative"}}>
          <input style={{...fs.field,marginTop:0,width:"100%",boxSizing:"border-box"}} placeholder="Sim name" value={name} onChange={e=>{setName(e.target.value);setShowSugg(true);}} onFocus={()=>setShowSugg(true)} onBlur={()=>setTimeout(()=>setShowSugg(false),150)} onKeyDown={e=>e.key==="Enter"&&add()}/>
          {showSugg&&sugg.length>0&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",borderRadius:"var(--border-radius-md)",zIndex:50,marginTop:"2px",overflow:"hidden"}}>
              {sugg.map(s=><div key={s} onMouseDown={()=>{setName(s);setShowSugg(false);}} style={{padding:"8px 10px",fontSize:"13px",cursor:"pointer",color:"var(--color-text-primary)"}} onMouseEnter={e=>e.currentTarget.style.background="var(--color-background-secondary)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{s}</div>)}
            </div>
          )}
        </div>
        <select style={{...fs.field,marginTop:0,flex:1}} value={type} onChange={e=>setType(e.target.value)}>{REL_TYPES.map(r=><option key={r}>{r}</option>)}</select>
        <button onClick={add} style={{padding:"8px 12px",fontSize:"13px",borderRadius:"var(--border-radius-md)",cursor:"pointer",whiteSpace:"nowrap"}}>Add</button>
      </div>
    </div>
  );
}

function RelBadges({relationships}){
  if(!relationships?.length) return null;
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginTop:"6px"}}>
      {relationships.map((r,i)=><div key={i} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"3px 8px",fontSize:"11px",color:"var(--color-text-primary)"}}><span style={{fontWeight:500}}>{r.name}</span><span style={{color:"var(--color-text-secondary)"}}> · {r.type}</span></div>)}
    </div>
  );
}

function ActionChip({type,text}){
  const colors={task:"#378ADD",relationship:"#D4537E",challenge:"#D85A30",fate:"#7F77DD"};
  const col=colors[type]||"#888";
  return(
    <div style={{display:"flex",alignItems:"flex-start",gap:"8px",padding:"7px 10px",borderRadius:"var(--border-radius-md)",background:"var(--color-background-secondary)",border:`0.5px solid ${col}33`,marginTop:"6px"}}>
      <span style={{fontSize:"13px",flexShrink:0,marginTop:"1px"}}>{ACTION_ICONS[type]||"📌"}</span>
      <div><span style={{fontSize:"10px",fontWeight:600,color:col,textTransform:"uppercase",letterSpacing:"0.05em"}}>{type}</span><p style={{margin:"2px 0 0",fontSize:"13px",color:"var(--color-text-primary)",lineHeight:1.5}}>{text}</p></div>
    </div>
  );
}

function BeatWithActions({beat,actions,index,onSelect}){
  const labels=["A","B","C","D","E"];
  return(
    <div style={{...fs.card,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--color-border-primary)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--color-border-tertiary)"} onClick={()=>onSelect(beat)}>
      <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
        <div style={{minWidth:"22px",height:"22px",borderRadius:"50%",background:"var(--color-background-secondary)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:500,color:"var(--color-text-secondary)",marginTop:"1px",flexShrink:0}}>{labels[index]}</div>
        <div style={{flex:1}}>
          <p style={{margin:0,fontSize:"14px",lineHeight:1.6,color:"var(--color-text-primary)"}}>{beat}</p>
          {actions?.length>0&&<div style={{marginTop:"6px"}} onClick={e=>e.stopPropagation()}>{actions.map((a,i)=><ActionChip key={i} type={a.type} text={a.text}/>)}</div>}
        </div>
      </div>
    </div>
  );
}

function SagaBeatWithActions({beat,actions,index}){
  const colors=["#7F77DD","#1D9E75","#D85A30","#D4537E","#378ADD"];
  return(
    <div style={{...fs.card,borderLeft:`3px solid ${colors[index%colors.length]}`}}>
      <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
        <div style={{minWidth:"22px",height:"22px",borderRadius:"50%",background:"var(--color-background-secondary)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:500,color:"var(--color-text-secondary)",marginTop:"1px",flexShrink:0}}>{index+1}</div>
        <div style={{flex:1}}>
          <p style={{margin:0,fontSize:"14px",lineHeight:1.6,color:"var(--color-text-primary)"}}>{beat}</p>
          {actions?.length>0&&<div style={{marginTop:"6px"}}>{actions.map((a,i)=><ActionChip key={i} type={a.type} text={a.text}/>)}</div>}
        </div>
      </div>
    </div>
  );
}

function ToDoList({items}){
  const [checked,setChecked]=useState({});
  if(!items?.length) return null;
  const colMap={task:"#378ADD",relationship:"#D4537E",challenge:"#D85A30",fate:"#7F77DD"};
  return(
    <div style={{...fs.card,background:"var(--color-background-secondary)",marginTop:"1rem"}}>
      <p style={{margin:"0 0 10px",fontSize:"12px",fontWeight:500,color:"var(--color-text-secondary)"}}>📋 GENERAL TO-DO LIST</p>
      {items.map((item,i)=>(
        <div key={i} onClick={()=>setChecked(c=>({...c,[i]:!c[i]}))} style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"6px 0",borderBottom:i<items.length-1?"0.5px solid var(--color-border-tertiary)":"none",cursor:"pointer"}}>
          <div style={{width:"16px",height:"16px",borderRadius:"3px",border:"0.5px solid var(--color-border-primary)",background:checked[i]?"var(--color-text-primary)":"transparent",flexShrink:0,marginTop:"2px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {checked[i]&&<span style={{color:"var(--color-background-primary)",fontSize:"11px",lineHeight:1}}>✓</span>}
          </div>
          <div style={{flex:1}}>
            <span style={{fontSize:"10px",fontWeight:600,color:colMap[item.type]||"#888",textTransform:"uppercase",letterSpacing:"0.05em",marginRight:"6px"}}>{ACTION_ICONS[item.type]||"📌"} {item.type}</span>
            <p style={{margin:"2px 0 0",fontSize:"13px",color:checked[i]?"var(--color-text-secondary)":"var(--color-text-primary)",textDecoration:checked[i]?"line-through":"none",lineHeight:1.5}}>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Legacy Chat ───────────────────────────────────────────────────────────────
function LegacyChat({members,events,familyName,onUpdateMember,onLogEvent}){
  const [messages,setMessages]=useState([{role:"assistant",content:`Hi! I'm your legacy diary. Tell me what's been happening with the ${familyName||"family"} — who aged up, who fell in love, any drama or surprises? I'll update their profiles and log it all to the chronicle for you. 📖`}]);
  const [input,setInput]=useState("");
  const [focusSim,setFocusSim]=useState("family");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const buildSystemPrompt=()=>{
    const byGen={};
    members.forEach(m=>{if(!byGen[m.generation])byGen[m.generation]=[];byGen[m.generation].push(m);});
    let ctx=`You are a warm, enthusiastic Sims 2 legacy diary assistant. You help the player track what's happening in their game by chatting naturally about events, then updating Sim profiles and logging story beats.\n\nFamily: ${familyName||"Unknown Legacy"}\n\nCURRENT FAMILY:\n`;
    Object.keys(byGen).sort((a,b)=>a-b).forEach(g=>{
      byGen[g].forEach(m=>{
        ctx+=`- ${m.name} (Gen ${m.generation}, ${m.age||"Adult"}, ${m.aspiration||"no aspiration"}${m.career&&m.career!=="Unemployed"?", "+m.career+" Lvl "+(m.careerLevel||1):""}${m.role?", "+m.role:""}${m.wants?.length?", wants: "+m.wants.join(", "):""}${m.fears?.length?", fears: "+m.fears.join(", "):""})\n`;
      });
    });
    if(events.length){ctx+=`\nRECENT CHRONICLE:\n`;events.slice(0,6).forEach(e=>{ctx+=`- [${e.simName}] ${e.beat}\n`;});}
    const focused=focusSim!=="family"?members.find(m=>m.id===parseInt(focusSim)):null;
    if(focused) ctx+=`\nThe player is currently focused on: ${focused.name}.`;
    ctx+=`\n\nWhen the player shares an update:
1. React warmly and naturally — show enthusiasm, ask a follow-up question about what happened.
2. At the end of your message, if any Sim data should be updated OR any story beats should be logged, include a JSON block wrapped in <update></update> tags with this shape:
{
  "memberUpdates": [
    { "name": "Sim name", "changes": { "age": "...", "career": "...", "careerLevel": "...", "mood": "...", "aspiration": "...", "role": "...", "wants": ["..."], "fears": ["..."] } }
  ],
  "chronicleEntries": [
    { "simName": "Sim name", "generation": 2, "beat": "Story beat text describing what happened." }
  ]
}
Only include fields that actually changed. Only include the <update> block if there is something to update or log. Do NOT include the block in casual conversation with no new info.`;
    return ctx;
  };

  const send=async()=>{
    if(!input.trim()||loading) return;
    const userMsg={role:"user",content:input.trim()};
    const newMsgs=[...messages,userMsg];
    setMessages(newMsgs); setInput(""); setLoading(true);
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,system:buildSystemPrompt(),messages:newMsgs.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      const raw=data.content.map(i=>i.text||"").join("");

      // Extract and apply updates
      const updateMatch=raw.match(/<update>([\s\S]*?)<\/update>/);
      let appliedUpdates=[];
      let loggedBeats=[];
      if(updateMatch){
        try{
          const parsed=JSON.parse(updateMatch[1].trim());
          // Apply member updates
          if(parsed.memberUpdates?.length){
            parsed.memberUpdates.forEach(u=>{
              const sim=members.find(m=>m.name.toLowerCase()===u.name.toLowerCase());
              if(sim){
                const updated={...sim,...u.changes,
                  wants:u.changes.wants||sim.wants||[],
                  fears:u.changes.fears||sim.fears||[],
                };
                onUpdateMember(updated);
                appliedUpdates.push(u.name);
              }
            });
          }
          // Log chronicle entries
          if(parsed.chronicleEntries?.length){
            parsed.chronicleEntries.forEach(e=>{
              onLogEvent({beat:e.beat,simName:e.simName,generation:e.generation||1,ts:Date.now()});
              loggedBeats.push(e.simName);
            });
          }
        }catch{}
      }

      // Clean response text
      const cleanText=raw.replace(/<update>[\s\S]*?<\/update>/g,"").trim();

      // Add status note if updates happened
      let statusNote="";
      if(appliedUpdates.length) statusNote+=`\n\n✅ Updated profile${appliedUpdates.length>1?"s":""}: ${appliedUpdates.join(", ")}`;
      if(loggedBeats.length) statusNote+=`\n📖 Logged to chronicle: ${[...new Set(loggedBeats)].join(", ")}`;

      setMessages([...newMsgs,{role:"assistant",content:cleanText+(statusNote?statusNote:"")}]);
    }catch{
      setMessages([...newMsgs,{role:"assistant",content:"Oops, something went wrong! Try again."}]);
    }
    setLoading(false);
  };

  const aliveSims=members.filter(m=>m.age!=="Deceased");

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Focus selector */}
      <div style={{marginBottom:"12px"}}>
        <label style={fs.label}>Chatting about</label>
        <select style={fs.field} value={focusSim} onChange={e=>setFocusSim(e.target.value)}>
          <option value="family">The whole family</option>
          {aliveSims.map(m=><option key={m.id} value={m.id}>{m.name} (Gen {m.generation})</option>)}
        </select>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",marginBottom:"12px",display:"flex",flexDirection:"column",gap:"10px",maxHeight:"420px",padding:"4px 0"}}>
        {messages.map((msg,i)=>(
          <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:"var(--border-radius-lg)",fontSize:"13px",lineHeight:1.6,
              background:msg.role==="user"?"var(--color-text-primary)":"var(--color-background-secondary)",
              color:msg.role==="user"?"var(--color-background-primary)":"var(--color-text-primary)",
              borderBottomRightRadius:msg.role==="user"?"4px":undefined,
              borderBottomLeftRadius:msg.role==="assistant"?"4px":undefined,
            }}>
              {msg.content.split("\n").map((line,j)=>(
                <span key={j}>{line}{j<msg.content.split("\n").length-1&&<br/>}</span>
              ))}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",justifyContent:"flex-start"}}>
            <div style={{padding:"10px 14px",borderRadius:"var(--border-radius-lg)",background:"var(--color-background-secondary)",fontSize:"13px",color:"var(--color-text-secondary)"}}>
              Updating the legacy...
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{display:"flex",gap:"8px"}}>
        <textarea
          style={{...fs.field,marginTop:0,flex:1,resize:"none",minHeight:"44px",maxHeight:"120px"}}
          placeholder={focusSim==="family"?"Tell me what's been happening with the family...":"Tell me what's happened..."}
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
        />
        <button onClick={send} disabled={loading||!input.trim()} style={{padding:"10px 16px",fontSize:"13px",fontWeight:500,cursor:loading||!input.trim()?"not-allowed":"pointer",opacity:loading||!input.trim()?0.5:1,borderRadius:"var(--border-radius-md)",whiteSpace:"nowrap",alignSelf:"flex-end"}}>Send</button>
      </div>
      <p style={{fontSize:"11px",color:"var(--color-text-secondary)",margin:"6px 0 0"}}>Press Enter to send · Shift+Enter for new line</p>
    </div>
  );
}

// ── Sim Modal ─────────────────────────────────────────────────────────────────
function SimModal({sim,events,members,onClose,onSave,onLoadToGenerator,onDelete}){
  const [editing,setEditing]=useState(false);
  const [editSim,setEditSim]=useState({...sim,wants:sim.wants||[],fears:sim.fears||[],traits:sim.traits||defaultTraits,relationships:sim.relationships||[]});
  const simEvents=events.filter(e=>e.simName===sim.name&&e.generation===sim.generation);
  const col=GEN_COLORS[(sim.generation-1)%GEN_COLORS.length];
  const setE=(k,v)=>setEditSim(s=>({...s,[k]:v}));
  const setETrait=(k,v)=>setEditSim(s=>({...s,traits:{...s.traits,[k]:v}}));
  const handleSave=()=>{onSave(editSim);setEditing(false);};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"1rem"}}>
      <div style={{background:"var(--color-background-primary)",borderRadius:"var(--border-radius-lg)",border:"0.5px solid var(--color-border-tertiary)",width:"100%",maxWidth:"500px",maxHeight:"85vh",overflowY:"auto",padding:"1.25rem",color:"#fff"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"40px",height:"40px",borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:500,color:"#fff",flexShrink:0}}>{(editSim.name||sim.name).charAt(0)}</div>
            <div>
              {editing?<input style={{...fs.field,marginTop:0,fontSize:"15px",fontWeight:500,padding:"4px 8px"}} value={editSim.name} onChange={e=>setE("name",e.target.value)}/>:<p style={{margin:0,fontSize:"16px",fontWeight:500,color:"#fff"}}>{sim.name}</p>}
              <p style={{margin:0,fontSize:"12px",color:sim.age==="Deceased"?"#ff9999":"#ccc"}}>Generation {sim.generation}{sim.age?` · ${sim.age}`:""}</p>
            </div>
          </div>
          <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
            {!editing&&<button onClick={()=>setEditing(true)} style={{fontSize:"12px",padding:"5px 10px",cursor:"pointer",borderRadius:"var(--border-radius-md)"}}>✏️ Edit</button>}
            <button onClick={onClose} style={{fontSize:"18px",background:"none",border:"none",cursor:"pointer",color:"#ccc",lineHeight:1,padding:"4px"}}>×</button>
          </div>
        </div>

        {!editing?(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"1rem"}}>
              {[["Aspiration",sim.aspiration],["Role",sim.role],["Career",sim.career?(sim.career+(sim.careerLevel&&sim.career!=="Unemployed"?` (Lvl ${sim.careerLevel})`:"")):""],["Mood",sim.mood]].filter(([,v])=>v).map(([k,v])=>(
                <div key={k} style={{background:"rgba(255,255,255,0.1)",borderRadius:"var(--border-radius-md)",padding:"8px 10px"}}>
                  <p style={{margin:"0 0 2px",fontSize:"11px",color:"#ccc"}}>{k}</p>
                  <p style={{margin:0,fontSize:"13px",color:"#fff"}}>{v}</p>
                </div>
              ))}
            </div>
            {(sim.wants?.length>0||sim.fears?.length>0)&&<div style={{marginBottom:"1rem"}}><p style={{margin:"0 0 6px",fontSize:"12px",fontWeight:500,color:"#ccc"}}>WANTS & FEARS</p><WantsFearBadges wants={sim.wants} fears={sim.fears}/></div>}
            {sim.traits&&(
              <div style={{marginBottom:"1rem"}}>
                <p style={{margin:"0 0 8px",fontSize:"12px",fontWeight:500,color:"#ccc"}}>PERSONALITY</p>
                {TRAITS.map(t=>(
                  <div key={t.key} style={{marginBottom:"6px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"2px"}}><span style={{fontSize:"11px",color:"#ccc"}}>{t.left}</span><span style={{fontSize:"11px",color:"#ccc"}}>{t.right}</span></div>
                    <div style={{height:"6px",borderRadius:"3px",background:"rgba(255,255,255,0.15)",overflow:"hidden"}}><div style={{height:"100%",width:`${(sim.traits[t.key]/10)*100}%`,background:col,borderRadius:"3px"}}/></div>
                  </div>
                ))}
              </div>
            )}
            {sim.relationships?.length>0&&<div style={{marginBottom:"1rem"}}><p style={{margin:"0 0 6px",fontSize:"12px",fontWeight:500,color:"#ccc"}}>RELATIONSHIPS</p><RelBadges relationships={sim.relationships}/></div>}
            {simEvents.length>0&&(
              <div style={{marginBottom:"1rem"}}>
                <p style={{margin:"0 0 8px",fontSize:"12px",fontWeight:500,color:"#ccc"}}>STORY BEATS</p>
                <div style={{position:"relative",paddingLeft:"16px"}}>
                  <div style={{position:"absolute",left:"5px",top:0,bottom:0,width:"1px",background:"rgba(255,255,255,0.2)"}}/>
                  {simEvents.map((ev,i)=>(
                    <div key={i} style={{position:"relative",marginBottom:"10px"}}>
                      <div style={{position:"absolute",left:"-13px",top:"5px",width:"7px",height:"7px",borderRadius:"50%",background:col}}/>
                      <p style={{margin:0,fontSize:"13px",color:"#fff",lineHeight:1.5}}>{ev.beat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:"8px",paddingTop:"8px",borderTop:"0.5px solid rgba(255,255,255,0.15)"}}>
              <button onClick={()=>onLoadToGenerator(sim)} style={{flex:1,padding:"8px",fontSize:"13px",cursor:"pointer",borderRadius:"var(--border-radius-md)"}}>Load into generator ↗</button>
              <button onClick={()=>onDelete(sim.id)} style={{padding:"8px 12px",fontSize:"13px",cursor:"pointer",borderRadius:"var(--border-radius-md)",color:"#ff9999",borderColor:"#ff999966"}}>Remove</button>
            </div>
          </>
        ):(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
              <div><label style={fs.label}>Age stage</label><select style={fs.field} value={editSim.age} onChange={e=>setE("age",e.target.value)}><option value="">Select...</option>{AGE_STAGES.map(a=><option key={a}>{a}</option>)}</select></div>
              <div><label style={fs.label}>Generation</label><input style={fs.field} type="number" min="1" max="20" value={editSim.generation} onChange={e=>setE("generation",parseInt(e.target.value)||1)}/></div>
              <div><label style={fs.label}>Aspiration</label><select style={fs.field} value={editSim.aspiration} onChange={e=>setE("aspiration",e.target.value)}><option value="">Select...</option>{ASPIRATIONS.map(a=><option key={a}>{a}</option>)}</select></div>
              <div><label style={fs.label}>Mood</label><select style={fs.field} value={editSim.mood||""} onChange={e=>setE("mood",e.target.value)}><option value="">Select...</option>{MOODS.map(m=><option key={m}>{m}</option>)}</select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"8px",marginBottom:"12px",alignItems:"end"}}>
              <div><label style={fs.label}>Career</label><select style={fs.field} value={editSim.career||""} onChange={e=>setE("career",e.target.value)}><option value="">Select...</option>{CAREERS.map(c=><option key={c}>{c}</option>)}</select></div>
              {editSim.career&&editSim.career!=="Unemployed"&&<div style={{minWidth:"80px"}}><label style={fs.label}>Level</label><select style={fs.field} value={editSim.careerLevel||"1"} onChange={e=>setE("careerLevel",e.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}</select></div>}
            </div>
            <div style={{marginBottom:"12px"}}><label style={fs.label}>Role in family</label><input style={fs.field} placeholder="e.g. Heiress, black sheep uncle" value={editSim.role||""} onChange={e=>setE("role",e.target.value)}/></div>
            <div style={{...fs.card,marginBottom:"12px"}}><label style={{...fs.label,marginBottom:"10px"}}>Personality</label><TraitSliders traits={editSim.traits} onChange={setETrait}/></div>
            <div style={{marginBottom:"12px"}}><label style={{...fs.label,marginBottom:"6px"}}>Relationships</label><RelationshipInput relationships={editSim.relationships} onChange={v=>setE("relationships",v)} members={members} currentName={editSim.name}/></div>
            <div style={{...fs.card,marginBottom:"12px"}}><label style={{...fs.label,marginBottom:"10px"}}>Wants & Fears</label><div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}><WantsFearInput label="Wants ★" color="#1D9E75" items={editSim.wants} onChange={v=>setE("wants",v)} suggestions={WANT_SUGGESTIONS}/><WantsFearInput label="Fears ⚠" color="#D85A30" items={editSim.fears} onChange={v=>setE("fears",v)} suggestions={FEAR_SUGGESTIONS}/></div></div>
            <div style={{display:"flex",gap:"8px",paddingTop:"8px",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
              <button onClick={handleSave} style={{flex:1,padding:"9px",fontSize:"13px",fontWeight:500,cursor:"pointer",borderRadius:"var(--border-radius-md)",background:"var(--color-text-primary)",color:"var(--color-background-primary)",border:"none"}}>Save changes</button>
              <button onClick={()=>{setEditSim({...sim,wants:sim.wants||[],fears:sim.fears||[],traits:sim.traits||defaultTraits,relationships:sim.relationships||[]});setEditing(false);}} style={{padding:"9px 14px",fontSize:"13px",cursor:"pointer",borderRadius:"var(--border-radius-md)"}}>Cancel</button>
              <button onClick={()=>onDelete(sim.id)} style={{padding:"9px 12px",fontSize:"13px",cursor:"pointer",borderRadius:"var(--border-radius-md)",color:"var(--color-text-danger)",borderColor:"var(--color-border-danger)"}}>Remove</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FamilyTree({members,onSelect}){
  if(!members.length) return <p style={{fontSize:"13px",color:"var(--color-text-secondary)",margin:0}}>No family members yet.</p>;
  const byGen={};
  members.forEach(m=>{if(!byGen[m.generation])byGen[m.generation]=[];byGen[m.generation].push(m);});
  return(
    <div style={{overflowX:"auto"}}>
      {Object.keys(byGen).sort((a,b)=>a-b).map(g=>(
        <div key={g} style={{display:"flex",alignItems:"flex-start",gap:"8px",marginBottom:"12px"}}>
          <div style={{minWidth:"52px",fontSize:"11px",fontWeight:500,color:"var(--color-text-secondary)",paddingTop:"14px"}}>Gen {g}</div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {byGen[g].map(m=>(
              <div key={m.id} onClick={()=>onSelect(m)} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"8px 12px",borderLeft:`3px solid ${GEN_COLORS[(g-1)%GEN_COLORS.length]}`,minWidth:"120px",cursor:"pointer",opacity:m.age==="Deceased"?0.6:1}} onMouseEnter={e=>e.currentTarget.style.outline="1px solid var(--color-border-secondary)"} onMouseLeave={e=>e.currentTarget.style.outline="none"}>
                <p style={{margin:0,fontSize:"13px",fontWeight:500,color:"var(--color-text-primary)"}}>{m.name}</p>
                <p style={{margin:0,fontSize:"11px",color:m.age==="Deceased"?"var(--color-text-danger)":"var(--color-text-secondary)"}}>{m.age||""}{m.aspiration&&m.age!=="Deceased"?` · ${m.aspiration}`:""}</p>
                {m.role&&<p style={{margin:"2px 0 0",fontSize:"11px",color:"var(--color-text-secondary)"}}>{m.role}</p>}
                {m.relationships?.length>0&&<RelBadges relationships={m.relationships}/>}
                <WantsFearBadges wants={m.wants} fears={m.fears}/>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline({events}){
  if(!events.length) return <p style={{fontSize:"13px",color:"var(--color-text-secondary)",margin:0}}>No events logged yet.</p>;
  return(
    <div style={{position:"relative",paddingLeft:"20px"}}>
      <div style={{position:"absolute",left:"6px",top:0,bottom:0,width:"1px",background:"var(--color-border-secondary)"}}/>
      {events.map((ev,i)=>(
        <div key={i} style={{position:"relative",marginBottom:"14px"}}>
          <div style={{position:"absolute",left:"-17px",top:"4px",width:"8px",height:"8px",borderRadius:"50%",background:GEN_COLORS[(ev.generation-1)%GEN_COLORS.length]}}/>
          <p style={{margin:"0 0 1px",fontSize:"11px",color:"var(--color-text-secondary)"}}>Gen {ev.generation} · {ev.simName}</p>
          <p style={{margin:0,fontSize:"13px",color:"var(--color-text-primary)",lineHeight:1.5}}>{ev.beat}</p>
        </div>
      ))}
    </div>
  );
}

function FamilySagaGenerator({members,events,familyName}){
  const [sagaBeats,setSagaBeats]=useState([]);const [todoList,setTodoList]=useState([]);
  const [loading,setLoading]=useState(false);const [error,setError]=useState("");
  const [focus,setFocus]=useState("whole");const [theme,setTheme]=useState("Any");
  const THEMES=["Any","Romantic drama","Family rivalries","Career & ambition","Supernatural events","Community & neighbourhood drama"];

  const buildPrompt=()=>{
    const byGen={};
    members.forEach(m=>{if(!byGen[m.generation])byGen[m.generation]=[];byGen[m.generation].push(m);});
    const maxGen=Math.max(...members.map(m=>m.generation));
    let ctx=`You are a Sims 2 storyteller.\nFamily: ${familyName||"Unknown Legacy"}, ${maxGen} generation(s).\n\nFAMILY:\n`;
    Object.keys(byGen).sort((a,b)=>a-b).forEach(g=>{
      ctx+=`Gen ${g}:\n`;
      byGen[g].forEach(m=>{
        ctx+=`  • ${m.name} — ${m.age||"Adult"}, ${m.aspiration||"no aspiration"}${m.role?", "+m.role:""}, rels: ${m.relationships?.length?m.relationships.map(r=>r.name+" ("+r.type+")").join(", "):"none"}${m.wants?.length?", wants: "+m.wants.join(", "):""}${m.fears?.length?", fears: "+m.fears.join(", "):""}\n`;
      });
    });
    if(events.length){ctx+=`\nCHRONICLE:\n`;events.slice(0,10).forEach(e=>{ctx+=`  - [Gen ${e.generation} · ${e.simName}] ${e.beat}\n`;});}
    const focusSim=focus!=="whole"?members.find(m=>m.id===parseInt(focus)):null;
    ctx+=focusSim?`\nCentre saga on ${focusSim.name}, weaving in others.`:"\nWhole family as protagonist.";
    if(theme!=="Any") ctx+=`\nTheme: ${theme}.`;
    ctx+=`\nFulfil or frustrate wants; use fears for tension.\nReturn JSON only:\n{"beats":[{"beat":"text","actions":[{"type":"task"|"relationship"|"challenge"|"fate","text":"action"}]}],"todo":[{"type":"...","text":"..."}]}\n5 beats, 0-2 actions each. todo: 3-6 items. No preamble, no backticks.`;
    return ctx;
  };

  const generate=async()=>{
    if(!members.length){setError("Add some family members first!");return;}
    setError("");setLoading(true);setSagaBeats([]);setTodoList([]);
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:buildPrompt()}]})});
      const data=await res.json();
      const text=data.content.map(i=>i.text||"").join("");
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      setSagaBeats(parsed.beats||[]);setTodoList(parsed.todo||[]);
    }catch{setError("Something went wrong. Try again!");}
    setLoading(false);
  };

  return(
    <div>
      <p style={{fontSize:"13px",color:"var(--color-text-secondary)",marginTop:0,marginBottom:"1rem",lineHeight:1.6}}>Generate a storyline for your <strong style={{color:"var(--color-text-primary)"}}>whole family</strong> — weaving together multiple Sims, cross-generational drama, wants & fears.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
        <div><label style={fs.label}>Story focus</label><select style={fs.field} value={focus} onChange={e=>setFocus(e.target.value)}><option value="whole">Whole family saga</option>{members.filter(m=>m.age!=="Deceased").map(m=><option key={m.id} value={m.id}>{m.name} (Gen {m.generation})</option>)}</select></div>
        <div><label style={fs.label}>Theme</label><select style={fs.field} value={theme} onChange={e=>setTheme(e.target.value)}>{THEMES.map(t=><option key={t}>{t}</option>)}</select></div>
      </div>
      <div style={{...fs.card,marginBottom:"12px",background:"var(--color-background-secondary)"}}>
        <p style={{margin:"0 0 6px",fontSize:"11px",fontWeight:500,color:"var(--color-text-secondary)"}}>FAMILY SNAPSHOT</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
          {members.map(m=>(
            <div key={m.id} style={{background:"var(--color-background-primary)",borderRadius:"var(--border-radius-md)",padding:"3px 8px",fontSize:"11px",color:"var(--color-text-primary)",opacity:m.age==="Deceased"?0.5:1,borderLeft:`2px solid ${GEN_COLORS[(m.generation-1)%GEN_COLORS.length]}`}}>
              {m.name}<span style={{color:"var(--color-text-secondary)"}}> G{m.generation}</span>
              {(m.wants?.length>0||m.fears?.length>0)&&<span style={{marginLeft:"4px",fontSize:"10px"}}>{m.wants?.length>0&&<span style={{color:"#1D9E75"}}>★{m.wants.length}</span>}{m.fears?.length>0&&<span style={{color:"#D85A30",marginLeft:"3px"}}>⚠{m.fears.length}</span>}</span>}
            </div>
          ))}
        </div>
      </div>
      {error&&<p style={{color:"var(--color-text-danger)",fontSize:"13px",marginBottom:"12px"}}>{error}</p>}
      <button onClick={generate} disabled={loading} style={{width:"100%",padding:"10px",fontSize:"14px",fontWeight:500,cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1,borderRadius:"var(--border-radius-md)",marginBottom:"1.5rem"}}>
        {loading?"Weaving the saga...":sagaBeats.length?"Regenerate family saga":"Generate family saga"}
      </button>
      {sagaBeats.length>0&&(
        <div>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
            <div style={{flex:1,height:"1px",background:"var(--color-border-tertiary)"}}/>
            <span style={{fontSize:"11px",color:"var(--color-text-secondary)",fontWeight:500}}>THE {(familyName||"FAMILY").toUpperCase()} SAGA</span>
            <div style={{flex:1,height:"1px",background:"var(--color-border-tertiary)"}}/>
          </div>
          {sagaBeats.map((b,i)=><SagaBeatWithActions key={i} beat={b.beat} actions={b.actions} index={i}/>)}
          {todoList.length>0&&<ToDoList items={todoList}/>}
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App(){
  const SEED=[
    {id:1,name:"Joanna Stone",age:"Deceased",aspiration:"",career:"",careerLevel:"1",generation:1,role:"Founder Matriarch",traits:defaultTraits,relationships:[{name:"Amar Danaher",type:"Husband"}],mood:"",wants:[],fears:[]},
    {id:2,name:"Amar Danaher",age:"Deceased",aspiration:"",career:"",careerLevel:"1",generation:1,role:"Founder Patriarch",traits:defaultTraits,relationships:[{name:"Joanna Stone",type:"Wife"}],mood:"",wants:[],fears:[]},
    {id:3,name:"Amelia Walters",age:"Elder",aspiration:"Knowledge",career:"",careerLevel:"1",generation:2,role:"Current Matriarch",traits:defaultTraits,relationships:[{name:"Colby Walters",type:"Husband"}],mood:"",wants:["Become a werewolf"],fears:["Die"]},
    {id:4,name:"Colby Walters",age:"Elder",aspiration:"Family",career:"",careerLevel:"1",generation:2,role:"Current Patriarch",traits:defaultTraits,relationships:[{name:"Amelia Walters",type:"Wife"}],mood:"",wants:[],fears:[]},
    {id:5,name:"Briar Danaher",age:"Adult",aspiration:"Fortune",career:"",careerLevel:"1",generation:2,role:"Cool Aunt",traits:defaultTraits,relationships:[{name:"Neil Danaher",type:"Husband"}],mood:"",wants:[],fears:[]},
    {id:6,name:"Neil Danaher",age:"Adult",aspiration:"Family",career:"",careerLevel:"1",generation:2,role:"New Uncle",traits:defaultTraits,relationships:[{name:"Briar Danaher",type:"Wife"}],mood:"",wants:[],fears:[]},
    {id:7,name:"Brigid Walters",age:"Teen",aspiration:"Knowledge",career:"",careerLevel:"1",generation:3,role:"Heiress",traits:defaultTraits,relationships:[{name:"Amelia Walters",type:"Parent"},{name:"Colby Walters",type:"Parent"}],mood:"",wants:[],fears:[]},
    {id:8,name:"Freya Walters",age:"Teen",aspiration:"Romance",career:"",careerLevel:"1",generation:3,role:"Magic Descendant",traits:defaultTraits,relationships:[{name:"Brigid Walters",type:"Sibling"},{name:"Amelia Walters",type:"Parent"},{name:"Colby Walters",type:"Parent"}],mood:"",wants:[],fears:[]},
    {id:9,name:"Alex Walters",age:"Child",aspiration:"",career:"",careerLevel:"1",generation:3,role:"Budding Newcomer",traits:defaultTraits,relationships:[{name:"Brigid Walters",type:"Sibling"},{name:"Freya Walters",type:"Sibling"},{name:"Amelia Walters",type:"Parent"},{name:"Colby Walters",type:"Parent"}],mood:"",wants:[],fears:[]},
    {id:10,name:"Selene Danaher",age:"Baby",aspiration:"",career:"",careerLevel:"1",generation:3,role:"Baby",traits:defaultTraits,relationships:[{name:"Briar Danaher",type:"Parent"},{name:"Neil Danaher",type:"Parent"}],mood:"",wants:[],fears:[]},
  ];

  const [tab,setTab]=useState("generator");const [legacyTab,setLegacyTab]=useState("timeline");
  const [form,setForm]=useState(defaultForm);const [traits,setTraits]=useState(defaultTraits);
  const [beats,setBeats]=useState([]);const [beatActions,setBeatActions]=useState([]);const [todoList,setTodoList]=useState([]);
  const [loading,setLoading]=useState(false);const [selectedBeat,setSelectedBeat]=useState(null);const [error,setError]=useState("");
  const [members,setMembers]=useState(SEED);const [events,setEvents]=useState([]);
  const [familyName,setFamilyName]=useState("The Stone-Danaher Legacy");
  const [selectedSim,setSelectedSim]=useState(null);const [addedSim,setAddedSim]=useState(null);
  const [storageLoaded,setStorageLoaded]=useState(false);
  const nextId=useRef(11);

  useEffect(()=>{
    (async()=>{
      try {
        // Load members
        const { data: membersData } = await supabase
          .from('members')
          .select('data')
          .order('id', { ascending: true });
        if (membersData?.length > 0) {
          setMembers(membersData.map(r => ({wants:[],fears:[],...r.data})));
        }

        // Load events
        const { data: eventsData } = await supabase
          .from('events')
          .select('data')
          .order('created_at', { ascending: false });
        if (eventsData?.length > 0) {
          setEvents(eventsData.map(r => r.data));
        }

        // Load family name
        const { data: settingsData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'familyName')
          .single();
        if (settingsData) setFamilyName(settingsData.value);

      } catch(e) { console.error(e); }
      setStorageLoaded(true);
    })();
  },[]);

  // Replace your existing save function with this:
  const save = async (nm, ne, nf, nn) => {
    try {
      // Save members if changed
      if (nm !== null && nm !== undefined) {
        await supabase.from('members').delete().neq('id', 0);
        if (nm.length > 0) {
          await supabase.from('members').insert(nm.map(m => ({ data: m })));
        }
      }

      // Save events if changed
      if (ne !== null && ne !== undefined) {
        await supabase.from('events').delete().neq('id', 0);
        if (ne.length > 0) {
          await supabase.from('events').insert(ne.map(e => ({ data: e })));
        }
      }

      // Save family name if changed
      if (nf !== null && nf !== undefined) {
        await supabase.from('settings').upsert({ key: 'familyName', value: nf });
      }
    } catch(e) { console.error(e); }
  };

  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const setTrait=(k,v)=>setTraits(t=>({...t,[k]:v}));

  const addMember=()=>{
    if(!form.name.trim()){setError("Name required.");return;}
    const m={id:nextId.current++,name:form.name,age:form.age,aspiration:form.aspiration,career:form.career,careerLevel:form.careerLevel,generation:parseInt(form.generation)||1,role:form.role,traits:{...traits},relationships:[...form.relationships],mood:form.mood,wants:[...form.wants],fears:[...form.fears]};
    const nm=[...members,m];setMembers(nm);save(nm,null,null,nextId.current);
    setError("");setAddedSim(form.name);
    setForm({...defaultForm,generation:form.generation});setTraits(defaultTraits);
    setBeats([]);setBeatActions([]);setTodoList([]);setSelectedBeat(null);
    setTimeout(()=>setAddedSim(null),3000);
  };

  const updateMember=(updated)=>{
    const nm=members.map(m=>m.id===updated.id?updated:m);
    setMembers(nm);save(nm,null,null,null);
    setSelectedSim(prev=>prev?.id===updated.id?updated:prev);
  };

  const updateMemberByName=(updated)=>{
    const nm=members.map(m=>m.id===updated.id?updated:m);
    setMembers(nm);save(nm,null,null,null);
  };

  const deleteMember=(id)=>{const nm=members.filter(m=>m.id!==id);setMembers(nm);save(nm,null,null,null);setSelectedSim(null);};

  const loadToGenerator=(sim)=>{
    setForm({name:sim.name,age:sim.age||"",aspiration:sim.aspiration||"",career:sim.career||"",careerLevel:sim.careerLevel||"1",relationships:sim.relationships||[],situation:"",recentEvents:"",mood:sim.mood||"",generation:String(sim.generation),role:sim.role||"",wants:sim.wants||[],fears:sim.fears||[]});
    setTraits(sim.traits||defaultTraits);
    setSelectedSim(null);setTab("generator");setBeats([]);setBeatActions([]);setTodoList([]);setSelectedBeat(null);
  };

  const logBeat=(beat)=>{
    const ev={beat,simName:form.name||"Unknown Sim",generation:parseInt(form.generation)||1,ts:Date.now()};
    const ne=[ev,...events];setEvents(ne);setSelectedBeat(beat);save(null,ne,null,null);
  };

  const logEventFromChat=(ev)=>{
    const ne=[ev,...events];setEvents(ne);save(null,ne,null,null);
  };

  const clearLegacy=async()=>{
    if(!window.confirm("Clear the entire legacy? This cannot be undone.")) return;
    setMembers(SEED);setEvents([]);setFamilyName("The Stone-Danaher Legacy");nextId.current=11;
    try{await window.storage.delete("legacy-familyName");await window.storage.delete("legacy-members");await window.storage.delete("legacy-events");await window.storage.delete("legacy-nextId");}catch{}
  };

  const buildContext=()=>{
    let ctx="";
    if(familyName) ctx+=`Legacy: ${familyName}\n`;
    if(members.length){ctx+=`Family:\n`;members.forEach(m=>{ctx+=`- ${m.name} (Gen ${m.generation}, ${m.age||"Adult"}${m.aspiration?", "+m.aspiration:""}${m.career?", "+m.career:""}${m.role?", "+m.role:""}${m.relationships?.length?", rels: "+m.relationships.map(r=>r.name+" ("+r.type+")").join(", "):""}${m.wants?.length?", wants: "+m.wants.join(", "):""}${m.fears?.length?", fears: "+m.fears.join(", "):""  })\n`;});}
    if(events.length){ctx+=`Chronicle:\n`;events.slice(0,8).forEach(e=>{ctx+=`- [Gen ${e.generation} · ${e.simName}] ${e.beat}\n`;});}
    return ctx;
  };

  const generate=async()=>{
    if(!form.name.trim()){setError("Give your Sim a name!");return;}
    setError("");setLoading(true);setBeats([]);setBeatActions([]);setTodoList([]);
    const traitDesc=TRAITS.map(t=>`${t.label}: ${traits[t.key]}/10`).join(", ");
    const relDesc=form.relationships.length?form.relationships.map(r=>`${r.name} (${r.type})`).join(", "):"None";
    const prompt=`You are a Sims 2 storyteller. Generate 5 story beats with optional in-game actions.\n\n${buildContext()?`LEGACY:\n${buildContext()}\n`:""}\nSim: ${form.name}, ${form.age||"Adult"}, Gen ${form.generation||1}, ${form.aspiration||"no aspiration"}, ${form.career||"Unemployed"}${form.career&&form.career!=="Unemployed"?` Lvl ${form.careerLevel}`:""}, mood: ${form.mood||"Green"}\nTraits: ${traitDesc}\nRelationships: ${relDesc}\nWants: ${form.wants.length?form.wants.join(", "):"None"}\nFears: ${form.fears.length?form.fears.join(", "):"None"}\nSituation: ${form.situation||"Not specified"}\nRecent: ${form.recentEvents||"Nothing notable"}\n${selectedBeat?`Continuing from: "${selectedBeat}"`:""}Fulfil or frustrate wants; use fears for tension.\nReturn JSON only:\n{"beats":[{"beat":"text","actions":[{"type":"task"|"relationship"|"challenge"|"fate","text":"action"}]}],"todo":[{"type":"...","text":"..."}]}\n5 beats, 0-2 actions each. todo: 3-5 items. No preamble, no backticks.`;
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data.content.map(i=>i.text||"").join("");
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      setBeats(parsed.beats?.map(b=>b.beat)||[]);setBeatActions(parsed.beats?.map(b=>b.actions||[])||[]);setTodoList(parsed.todo||[]);
    }catch{setError("Something went wrong. Try again!");}
    setLoading(false);
  };

  const TabBtn=({id,label,badge})=>(
    <button onClick={()=>setTab(id)} style={{padding:"8px 16px",fontSize:"13px",fontWeight:600,borderRadius:"8px",border:"none",background:tab===id?THEME.gold:"transparent",color:tab===id?"#fff":THEME.textMuted,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",transition:"all 0.2s"}}>
      {label}{badge&&<span style={{fontSize:"10px",background:"rgba(255,255,255,0.2)",borderRadius:"10px",padding:"1px 6px",color:tab===id?"#fff":THEME.textMuted}}>{badge}</span>}
    </button>
  );

  if(!storageLoaded) return <div style={{minHeight:"100vh",background:THEME.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{fontSize:"14px",color:THEME.brown}}>Loading legacy...</p></div>;

  return(
    <div style={{minHeight:"100vh",background:THEME.bg,padding:"0"}}>
      <div style={{maxWidth:"680px",margin:"0 auto",padding:"1.5rem 1rem"}}>
      {selectedSim&&<SimModal sim={selectedSim} events={events} members={members} onClose={()=>setSelectedSim(null)} onSave={updateMember} onLoadToGenerator={loadToGenerator} onDelete={deleteMember}/>}

      {/* Header */}
      <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
        <h1 style={{margin:"0 0 4px",fontSize:"22px",fontWeight:700,color:THEME.panel,letterSpacing:"0.05em",textTransform:"uppercase"}}>{familyName||"My Legacy"}</h1>
        <p style={{margin:0,fontSize:"12px",color:THEME.brown,letterSpacing:"0.08em",textTransform:"uppercase"}}>Sims 2 Legacy Planner</p>
      </div>

      <div style={{display:"flex",gap:"4px",marginBottom:"1.5rem",background:THEME.panel,borderRadius:"12px",padding:"6px",flexWrap:"wrap"}}>
        <TabBtn id="generator" label="Generator"/>
        <TabBtn id="saga" label="Family Saga" badge={members.length?`${members.length} Sims`:null}/>
        <TabBtn id="chat" label="Legacy Diary" badge="💬"/>
        <TabBtn id="legacy" label="Legacy"/>
      </div>

      {tab==="generator"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",marginBottom:"12px"}}>
            <div style={{gridColumn:"span 2"}}><label style={fs.label}>Sim name</label><input style={fs.field} placeholder="e.g. Bella Goth" value={form.name} onChange={e=>setF("name",e.target.value)}/></div>
            <div><label style={fs.label}>Generation</label><input style={fs.field} type="number" min="1" max="20" value={form.generation} onChange={e=>setF("generation",e.target.value)}/></div>
            <div><label style={fs.label}>Age stage</label><select style={fs.field} value={form.age} onChange={e=>setF("age",e.target.value)}><option value="">Select...</option>{AGE_STAGES.map(a=><option key={a}>{a}</option>)}</select></div>
            <div><label style={fs.label}>Aspiration</label><select style={fs.field} value={form.aspiration} onChange={e=>setF("aspiration",e.target.value)}><option value="">Select...</option>{ASPIRATIONS.map(a=><option key={a}>{a}</option>)}</select></div>
            <div><label style={fs.label}>Mood</label><select style={fs.field} value={form.mood} onChange={e=>setF("mood",e.target.value)}><option value="">Select...</option>{MOODS.map(m=><option key={m}>{m}</option>)}</select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"8px",marginBottom:"12px",alignItems:"end"}}>
            <div><label style={fs.label}>Career</label><select style={fs.field} value={form.career} onChange={e=>setF("career",e.target.value)}><option value="">Select...</option>{CAREERS.map(c=><option key={c}>{c}</option>)}</select></div>
            {form.career&&form.career!=="Unemployed"&&<div style={{minWidth:"80px"}}><label style={fs.label}>Level</label><select style={fs.field} value={form.careerLevel} onChange={e=>setF("careerLevel",e.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}</select></div>}
          </div>
          <div style={{marginBottom:"12px"}}><label style={fs.label}>Role in family</label><input style={fs.field} placeholder="e.g. Founder, heiress, black sheep uncle" value={form.role} onChange={e=>setF("role",e.target.value)}/></div>
          <div style={{...fs.card,marginBottom:"12px"}}><label style={{...fs.label,marginBottom:"10px"}}>Personality</label><TraitSliders traits={traits} onChange={setTrait}/></div>
          <div style={{marginBottom:"12px"}}><label style={{...fs.label,marginBottom:"6px"}}>Relationships</label><RelationshipInput relationships={form.relationships} onChange={v=>setF("relationships",v)} members={members} currentName={form.name}/></div>
          <div style={{...fs.card,marginBottom:"12px"}}><label style={{...fs.label,marginBottom:"10px"}}>Wants & Fears</label><div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}><WantsFearInput label="Wants ★" color="#1D9E75" items={form.wants} onChange={v=>setF("wants",v)} suggestions={WANT_SUGGESTIONS}/><WantsFearInput label="Fears ⚠" color="#D85A30" items={form.fears} onChange={v=>setF("fears",v)} suggestions={FEAR_SUGGESTIONS}/></div></div>
          <div style={{marginBottom:"12px"}}><label style={fs.label}>Current situation</label><textarea style={{...fs.field,resize:"vertical",minHeight:"60px"}} placeholder="e.g. Just moved, recently promoted" value={form.situation} onChange={e=>setF("situation",e.target.value)}/></div>
          <div style={{marginBottom:"12px"}}><label style={fs.label}>Recent events</label><textarea style={{...fs.field,resize:"vertical",minHeight:"60px"}} placeholder="e.g. Had twins, big fight with a neighbour" value={form.recentEvents} onChange={e=>setF("recentEvents",e.target.value)}/></div>
          <div style={{display:"flex",gap:"8px",marginBottom:"1.5rem",alignItems:"center"}}>
            <button onClick={addMember} style={{fontSize:"13px",padding:"8px 14px",borderRadius:"var(--border-radius-md)",cursor:"pointer"}}>+ Add to family tree</button>
            {addedSim&&<span style={{fontSize:"13px",color:"var(--color-text-success)"}}>✓ {addedSim} added</span>}
          </div>
          {selectedBeat&&(
            <div style={{...fs.card,background:"var(--color-background-secondary)",marginBottom:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px"}}>
              <div><p style={{margin:"0 0 2px",fontSize:"11px",fontWeight:500,color:"var(--color-text-secondary)"}}>CONTINUING FROM</p><p style={{margin:0,fontSize:"13px",color:"var(--color-text-primary)"}}>{selectedBeat}</p></div>
              <button style={{fontSize:"12px",padding:"4px 8px",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setSelectedBeat(null)}>Clear</button>
            </div>
          )}
          {error&&<p style={{color:"var(--color-text-danger)",fontSize:"13px",marginBottom:"12px"}}>{error}</p>}
          <button onClick={generate} disabled={loading} style={{width:"100%",padding:"10px",fontSize:"14px",fontWeight:500,cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1,borderRadius:"var(--border-radius-md)",marginBottom:"1.5rem"}}>
            {loading?"Generating...":beats.length?"Regenerate beats":"Generate plot beats"}
          </button>
          {beats.length>0&&(
            <div>
              <p style={{fontSize:"12px",color:"var(--color-text-secondary)",marginTop:0,marginBottom:"10px"}}>Click a beat to log it to the legacy chronicle.</p>
              {beats.map((b,i)=><BeatWithActions key={i} beat={b} actions={beatActions[i]} index={i} onSelect={logBeat}/>)}
              {todoList.length>0&&<ToDoList items={todoList}/>}
            </div>
          )}
        </div>
      )}

      {tab==="saga"&&<FamilySagaGenerator members={members} events={events} familyName={familyName}/>}

      {tab==="chat"&&(
        <div>
          <p style={{fontSize:"13px",color:"var(--color-text-secondary)",marginTop:0,marginBottom:"1rem",lineHeight:1.6}}>
            Tell me what's been happening in your game — I'll update Sim profiles and log it to the chronicle automatically. 📖
          </p>
          <LegacyChat members={members} events={events} familyName={familyName} onUpdateMember={updateMemberByName} onLogEvent={logEventFromChat}/>
        </div>
      )}

      {tab==="legacy"&&(
        <div>
          <div style={{marginBottom:"1.5rem"}}>
            <label style={fs.label}>Legacy / family name</label>
            <div style={{display:"flex",gap:"8px",marginTop:"4px"}}>
              <input style={{...fs.field,marginTop:0,flex:1}} placeholder="e.g. The Goth Legacy" value={familyName} onChange={e=>setFamilyName(e.target.value)}/>
              <button style={{fontSize:"13px",padding:"8px 14px",borderRadius:"8px",cursor:"pointer",whiteSpace:"nowrap",background:THEME.gold,color:"#fff",border:"none",fontWeight:600}} onClick={()=>save(null,null,familyName,null)}>Save</button>
            </div>
          </div>
          <div style={{display:"flex",gap:"4px",marginBottom:"1rem",background:THEME.panel,borderRadius:"10px",padding:"4px"}}>
            {[["timeline","Chronicle"],["tree","Family tree"]].map(([id,label])=>(
              <button key={id} onClick={()=>setLegacyTab(id)} style={{padding:"6px 14px",fontSize:"12px",fontWeight:600,borderRadius:"8px",border:"none",background:legacyTab===id?THEME.gold:"transparent",color:legacyTab===id?"#fff":THEME.textMuted,cursor:"pointer",transition:"all 0.2s"}}>{label}</button>
            ))}
          </div>
          {legacyTab==="timeline"&&<Timeline events={events}/>}
          {legacyTab==="tree"&&<FamilyTree members={members} onSelect={setSelectedSim}/>}
          {(members.length>0||events.length>0)&&<button onClick={clearLegacy} style={{marginTop:"2rem",fontSize:"12px",padding:"6px 12px",cursor:"pointer",color:THEME.danger,border:`1px solid ${THEME.danger}`,borderRadius:"8px",background:"transparent"}}>Clear entire legacy</button>}
        </div>
      )}
      </div>
    </div>
  );
}
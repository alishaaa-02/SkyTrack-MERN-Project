export default function Popup({popup,closePopup}){
  if(!popup) return null;
  return <div className="popupBackdrop" role="dialog" aria-modal="true"><div className={`popupBox ${popup.type==='success'?'success':''}`}><button className="popupClose" onClick={closePopup} aria-label="Close">×</button><div className="popupIcon">{popup.type==='success'?'✓':'!'}</div><h3>{popup.title}</h3><p>{popup.text}</p><button className="popupOk" onClick={closePopup}>OK</button></div></div>;
}

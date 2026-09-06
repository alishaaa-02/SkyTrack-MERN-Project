import { programs } from '../data/programs';
export default function TrainingPrograms(){
  return <section id="training" className="section"><h2>Training Programs</h2><div className="cards">{programs.map(p=><article className="card" key={p.title}><img src={p.image} alt={p.title}/><div><h3>{p.title}</h3><p>{p.text}</p></div></article>)}</div></section>;
}

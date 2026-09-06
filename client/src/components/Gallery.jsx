import { gallery } from '../data/programs';
export default function Gallery(){
  return <section id="gallery" className="section"><h2>Gallery</h2><div className="gallery">{gallery.map(g=><div className="galleryItem" key={g}><img src={'/media/'+g} alt="Aviation gallery"/></div>)}<div className="galleryItem galleryVideo"><video autoPlay muted loop playsInline controls><source src="/media/Trainee aircraft.mp4" type="video/mp4"/></video></div></div></section>;
}

import ThemeToggle from './ThemeToggle';

export default function Header({ darkMode, toggleTheme }){
  return <header><nav><a className="brand" href="#home">✈ <span>SkyTrack</span></a><div className="navlinks"><a href="#home">Home</a><a href="#registration">Registration</a><a href="#training">Training</a><a href="#gallery">Gallery</a><a href="#trainees">Trainees</a><a href="#contact">Contact</a><ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} /></div></nav></header>;
}

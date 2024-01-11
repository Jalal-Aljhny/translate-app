import heroImg from "../assets/hero_img.jpg";
import logo from "../assets/logo.svg";

const Hero = () => {
  return (
    <>
      <header>
        <img
          src={logo}
          alt="logo"
          className="logo"
          onClick={() => {
            window.location.reload();
          }}
        />
      </header>
      <img src={heroImg} alt="Hero background" className="hero_bg" />
    </>
  );
};

export default Hero;

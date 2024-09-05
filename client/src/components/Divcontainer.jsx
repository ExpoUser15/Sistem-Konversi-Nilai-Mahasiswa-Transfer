import PropTypes from "prop-types";

const Divcontainer = ({ className = "" }) => {
  return (
    <div
      className={`w-[350px] shadow-[0px_30px_30px_-20px_rgba(133,_189,_215,_0.88)] rounded-21xl [background:linear-gradient(0deg,_#fff,_#f4f7fb)] border-white border-[5px] border-solid box-border overflow-hidden shrink-0 flex flex-col items-start justify-start pt-4 pb-[68px] pl-5 pr-2.5 gap-[39px] max-w-full z-[1] text-center text-11xl text-steelblue font-roboto mq450:gap-[19px] mq450:pt-5 mq450:pb-11 mq450:box-border ${className}`}
    >
      <div className="w-[310px] flex flex-row items-start justify-between gap-5">
        <div className="flex flex-col items-start justify-start py-0 pl-0 pr-[9px]">
          <img
            className="w-[50px] h-[50.1px] relative object-cover"
            loading="lazy"
            alt=""
            src="/r-1@2x.png"
          />
        </div>
        <div className="w-[93.3px] flex flex-col items-start justify-start pt-[76px] px-0 pb-0 box-border">
          <h1 className="m-0 self-stretch relative text-inherit font-black font-[inherit] mix-blend-normal mq450:text-lg mq1050:text-5xl">
            Login
          </h1>
        </div>
        <img
          className="h-[52.5px] w-[70px] relative object-cover"
          loading="lazy"
          alt=""
          src="/kampus-merdeka-1@2x.png"
        />
      </div>
      <div className="w-[270px] h-2.5 relative hidden" />
      <div className="w-[310px] flex flex-row items-start justify-start py-0 pl-[15px] pr-[25px] box-border">
        <form className="m-0 flex-1 flex flex-col items-start justify-start gap-5">
          <div className="self-stretch flex flex-col items-start justify-start gap-[15px]">
            <input
              className="w-full [border:none] [outline:none] bg-white self-stretch h-[45px] shadow-[0px_10px_10px_-5px_#cff0ff] rounded-xl overflow-hidden shrink-0 flex flex-row items-start justify-start py-[15px] px-[22px] box-border font-roboto text-sm-3 text-darkgray min-w-[162px]"
              placeholder="Username"
              type="text"
            />
            <div className="self-stretch flex flex-col items-start justify-start gap-2.5">
              <input
                className="w-full [border:none] [outline:none] bg-white self-stretch h-[45px] shadow-[0px_10px_10px_-5px_#cff0ff] rounded-xl overflow-hidden shrink-0 flex flex-row items-start justify-start py-[15px] px-[22px] box-border font-roboto text-sm-3 text-darkgray min-w-[162px]"
                placeholder="Password"
                type="text"
              />
              <div className="flex flex-row items-start justify-start py-0 px-2.5">
                <div className="relative text-2xs font-roboto text-dodgerblue text-left inline-block mix-blend-normal min-w-[92px]">
                  Forgot Password ?
                </div>
              </div>
            </div>
          </div>
          <button className="cursor-pointer [border:none] py-[15px] px-5 bg-[transparent] self-stretch shadow-[0px_20px_10px_-15px_rgba(133,_189,_215,_0.88)] rounded-xl [background:linear-gradient(80.54deg,_#1089d3,_#12b1d1)] overflow-hidden flex flex-row items-start justify-center">
            <b className="w-[41.5px] relative text-sm-3 flex font-roboto text-white text-center items-center justify-center shrink-0 mix-blend-normal">
              Login
            </b>
          </button>
        </form>
      </div>
    </div>
  );
};

Divcontainer.propTypes = {
  className: PropTypes.string,
};

export default Divcontainer;

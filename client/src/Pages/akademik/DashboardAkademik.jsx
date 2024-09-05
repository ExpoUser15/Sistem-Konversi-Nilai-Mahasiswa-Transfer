import ConversionChart from "../../components/Charts/ConversionChart";
import PieChart from "../../components/charts/PieChart";
import GoogleMaps from "../../components/maps/GoogleMaps";

function DashboardAkademik() {
  return (
    <>
      <div className="pb-1" style={{ borderBottom: "1px solid #CCCCCC" }}>
        <h3 className="font-medium">Good Morning, Gideon.</h3>
      </div>
      <main className="my-16">
        <div>
          <h4 className="font-medium">Overview</h4>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-7 bg-white px-5 py-2 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
            <h4 className="font-medium">Statistik Usia Mahasiswa Pindahan</h4>
            <div className="">
              <ConversionChart
                categories={['18-20', '21-23', '24-26', '27-29', '30+']}
                series={[5, 10, 15, 7, 3]}
              />
            </div>
          </div>
          <div className="col-span-5 bg-white px-5 py-2 rounded-md shadow dark:bg-black dark:shadow-neutral-700">
            <h4 className="font-medium">Jenis Kelamin</h4>
            <div className="m-auto">
              <PieChart series={[45, 55]} height={350} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 my-16 rounded-md shadow">
            <GoogleMaps />
        </div>
      </main>
    </>
  );
}

export default DashboardAkademik
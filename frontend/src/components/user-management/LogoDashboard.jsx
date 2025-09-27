import UIN from "@/assets/UIN.png";
export const LogoDashboard = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10">
        <img
          src={UIN}
          alt="UIN Sunan Kalijaga Logo"
          className="mb-4 object-contain"
          style={{ width: "40px", height: "40px", maxWidth: "40px", maxHeight: "40px" }}
        />
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Cinzel', serif",
          }}
          className="text-sm font-semibold text-yellow-600"
        >
          SUKA KEHILANGAN
        </div>
      </div>
    </div>
  );
};

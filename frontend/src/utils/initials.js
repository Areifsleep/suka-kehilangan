export const getInitials = (fullName) => {
  if (!fullName) return "NA"; // Jika nama kosong, kembalikan 'NA' atau placeholder lain

  const nameParts = fullName.split(" ").filter((part) => part.length > 0); // Memastikan tidak ada spasi ganda

  if (nameParts.length === 0) return "NA"; // Jika setelah filter tetap kosong

  // Ambil huruf pertama dari kata pertama dan kata kedua (jika ada)
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const secondInitial = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";

  return `${firstInitial}${secondInitial}`;
};

export enum Permission {
  // Laporan (Reports)
  CreateReportFound = 'CREATE-REPORT-FOUND',
  ViewOwnReports = 'VIEW-OWN-REPORTS',
  ViewAllReports = 'VIEW-ALL-REPORTS',
  UpdateOwnReport = 'UPDATE-OWN-REPORT',
  UpdateAnyReport = 'UPDATE-ANY-REPORT',
  UpdateReportStatus = 'UPDATE-REPORT-STATUS',
  DeleteOwnReport = 'DELETE-OWN-REPORT',
  DeleteAnyReport = 'DELETE-ANY-REPORT',

  // Klaim Barang (Item Claims)
  CreateClaim = 'CREATE-CLAIM',
  ViewClaims = 'VIEW-CLAIMS',
  VerifyClaim = 'VERIFY-CLAIM',

  // Manajemen Pengguna & Akun
  ManageOwnAccount = 'MANAGE-OWN-ACCOUNT',
  ManageUsers = 'MANAGE-USERS',
  ManageOfficers = 'MANAGE-OFFICERS',

  // Data Master & Sistem
  ViewDashboard = 'VIEW-DASHBOARD',
  ManageCategories = 'MANAGE-CATEGORIES',
  ExportReports = 'EXPORT-REPORTS',
}

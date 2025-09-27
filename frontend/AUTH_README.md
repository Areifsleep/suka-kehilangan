# Authentication System Documentation

## Overview

Sistem autentikasi yang robust untuk aplikasi React dengan fitur-fitur modern dan security best practices.

## Features

### ✅ Implemented Features

- **JWT Token Management**: Automatic token refresh dengan axios interceptors
- **Role-based Routing**: Redirect otomatis berdasarkan role user (USER, ADMIN, PETUGAS)
- **Protected Routes**: Route protection dengan authentication check
- **Login Form**: Form login dengan validasi dan error handling
- **Session Management**: Persistent session menggunakan React Query
- **Loading States**: Loading indicators untuk better UX
- **Error Handling**: Comprehensive error handling untuk berbagai skenario
- **Form Validation**: Custom validation hook yang reusable
- **Auto-focus**: Auto-focus pada username field
- **Password Toggle**: Toggle visibility password
- **Logout Functionality**: Secure logout dengan cleanup

### 🔧 Architecture

#### 1. AuthContext (`src/contexts/AuthContext.jsx`)

- Centralized authentication state management
- React Query integration untuk session management
- Auto token refresh handling
- Error state management
- Logout functionality

#### 2. Protected Routes (`src/components/ProtectedRoute.jsx`)

- Route protection based on authentication status
- Role-based redirection
- Seamless navigation experience

#### 3. Login Page (`src/pages/LoginPage.jsx`)

- Modern form with validation
- Loading states dan error handling
- Auto-focus dan keyboard accessibility
- Responsive design

#### 4. Axios Configuration (`src/lib/axios.js`)

- Auto token refresh interceptor
- Environment variable validation
- Credentials handling

### 📁 File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Main auth context
├── components/
│   ├── ProtectedRoute.jsx       # Route protection
│   ├── RedirectIfLoggedIn.jsx   # Login redirect logic
│   └── LogoutButton.jsx         # Reusable logout button
├── pages/
│   └── LoginPage.jsx            # Login form
├── hooks/
│   └── useFormValidation.js     # Custom validation hook
└── lib/
    └── axios.js                 # Axios configuration
```

## Usage Examples

### 1. Using Auth Context

```jsx
import { useAuth } from "@/contexts/AuthContext";

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Using Logout Button

```jsx
import { LogoutButton } from "@/components/LogoutButton";

function Header() {
  return (
    <header>
      <LogoutButton className="ml-auto" />
    </header>
  );
}
```

### 3. Using Form Validation Hook

```jsx
import { useFormValidation, validationRules } from "@/hooks/useFormValidation";

function MyForm() {
  const { errors, validate, clearError } = useFormValidation({
    email: [validationRules.required(), validationRules.email()],
  });

  const handleSubmit = (formData) => {
    if (validate(formData)) {
      // Submit form
    }
  };
}
```

## Security Features

### 1. Token Management

- **Auto Refresh**: Tokens di-refresh otomatis saat expired
- **Secure Storage**: Menggunakan httpOnly cookies (backend implementation required)
- **Infinite Loop Prevention**: Mencegah infinite refresh loops

### 2. Route Protection

- **Authentication Check**: Semua protected routes memerlukan authentication
- **Role-based Access**: User diarahkan ke dashboard sesuai role mereka
- **Unauthorized Handling**: Auto-redirect ke login page untuk unauthorized access

### 3. Input Validation

- **Client-side Validation**: Validasi form sebelum submit
- **XSS Prevention**: Input sanitization dan validation
- **Error Messages**: Clear error messages untuk user guidance

## Environment Variables

Required environment variables:

```bash
VITE_BACKEND_URL=http://localhost:3000  # Backend API URL
```

## API Endpoints

Expected backend endpoints:

- `GET /auth/session` - Get current user session
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/refresh` - Refresh tokens

## Error Handling

### Network Errors

- Auto-retry untuk network failures
- User-friendly error messages
- Fallback UI untuk connection issues

### Authentication Errors

- 401: Auto-redirect ke login
- 403: Access denied messages
- 500: Server error handling

### Form Errors

- Field-level validation errors
- Server response error messages
- Real-time error clearing

## Best Practices Implemented

1. **Performance Optimization**

   - `useMemo` untuk mencegah unnecessary re-renders
   - React Query untuk efficient data fetching
   - Lazy loading untuk better initial load time

2. **User Experience**

   - Loading states untuk semua async operations
   - Auto-focus pada form fields
   - Keyboard accessibility
   - Responsive design

3. **Code Quality**

   - Custom hooks untuk reusability
   - Clear separation of concerns
   - Comprehensive error handling
   - TypeScript-ready structure

4. **Security**
   - Secure token handling
   - Input validation dan sanitization
   - Protected routes implementation
   - Auto-logout on token expiry

## Future Enhancements

Potential improvements untuk production:

- [ ] Remember me functionality
- [ ] Two-factor authentication
- [ ] Session timeout warnings
- [ ] Audit logging
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Password strength validation
- [ ] Account lockout mechanism

## Testing

Untuk testing authentication system:

1. Test login flow dengan valid/invalid credentials
2. Test route protection dan redirects
3. Test token refresh scenarios
4. Test logout functionality
5. Test form validation
6. Test error handling scenarios

## Support

Untuk bantuan atau pertanyaan terkait authentication system, silakan buat issue di repository atau hubungi tim development.

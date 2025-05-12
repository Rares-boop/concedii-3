export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="login-page"> {/* Use a wrapper div instead */}
        <main>{children}</main>
      </div>
    );
  }
  
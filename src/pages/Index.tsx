import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to admin panel on app load
    navigate('/admin');
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Redirecting to Admin Panel...</h1>
        <p className="text-xl text-muted-foreground">Loading your product management dashboard</p>
      </div>
    </div>
  );
};

export default Index;

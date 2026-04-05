import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import LogOutIcon from "lucide-react/dist/esm/icons/log-out.js";
import PlusIcon from "lucide-react/dist/esm/icons/plus.js";
import { clearAuthSession, getAuthUser } from "../lib/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [showAvatarImage, setShowAvatarImage] = useState(Boolean(user?.picture));

  useEffect(() => {
    setShowAvatarImage(Boolean(user?.picture));
  }, [user?.picture]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-3 py-3 sm:p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl md:text-3xl font-bold text-primary font-mono tracking-tight">
            RememberDaily
          </Link>
          <div className="flex items-center gap-4">
            {user?.name && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-base-content/80">
                {user.picture && showAvatarImage ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/30"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      setShowAvatarImage(false);
                    }}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                    {userInitial}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
            )}

            <Link to={"/create"} className="btn btn-primary btn-sm sm:btn-md">
              <PlusIcon className="size-4 sm:size-5" />
              <span className="hidden sm:inline">New Note</span>
            </Link>

            <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm sm:btn-md">
              <LogOutIcon className="size-4 sm:size-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

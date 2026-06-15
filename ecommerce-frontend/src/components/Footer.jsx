const Footer = () => {
    return (
      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-zinc-500">
            © 2026 STRIDE. All rights reserved.
          </p>
  
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-lime-400"
            >
              About
            </a>
  
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-lime-400"
            >
              Contact
            </a>
  
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-lime-400"
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
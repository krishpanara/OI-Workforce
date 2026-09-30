import Image from 'next/image';
import { IMAGES } from '@/lib/images';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Image className="footer-logo-img" src={IMAGES.logo} alt="Hyphen OI Workforce" width={96} height={24} />
            <p style={{ fontSize: '13.5px', color: 'var(--grey)', maxWidth: '260px' }}>A governed AI workforce platform from Hyphen Connect.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="#product">How it works</a></li>
              <li><a href="#usecases">Use cases</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#pricing">Talk to us</a></li>
              <li><a href="#about">Hyphen Connect</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#data-handling">Data handling</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Hyphen OI Workforce. All rights reserved.</span>
          <span>oiworkforce.com</span>
        </div>
      </div>
    </footer>
  );
}

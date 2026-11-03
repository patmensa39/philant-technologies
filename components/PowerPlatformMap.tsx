import { PLATFORM_HUB, PLATFORM_ICON, PLATFORM_NODES, TRADEMARK_NOTE, type PlatformProduct } from '@/lib/power-platform';

function Product({ p, className }: { p: PlatformProduct; className: string }) {
  // Icons are decorative: the product name beside each one carries the meaning.
  return (
    <li className={`pp-item ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.icon} alt="" width={96} height={96} loading="lazy" decoding="async" />
      <div>
        <h3>{p.name}</h3>
        <p>{p.description}</p>
      </div>
    </li>
  );
}

export function PowerPlatformMap() {
  return (
    <section className="section" aria-labelledby="pp-title">
      <div className="wrap">
        <div className="pp-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PLATFORM_ICON.icon} alt="" width={96} height={96} />
          <div>
            <h2 id="pp-title">Built on the Microsoft Power Platform</h2>
            <p className="muted">The products I design and build with, and how they connect around a shared data layer.</p>
          </div>
        </div>
        <ul className="pp-map" aria-label="Power Platform products">
          <Product p={PLATFORM_HUB} className="pp-hub" />
          {PLATFORM_NODES.map((n) => <Product key={n.id} p={n} className={`pp-node pp-${n.id}`} />)}
        </ul>
        <p className="muted small pp-note">{TRADEMARK_NOTE}</p>
      </div>
    </section>
  );
}

import '../styles/cosmos-effect.css';

// One CSS backdrop for the whole page; no bitmap, canvas or pointer listeners.
export function CosmosPointerEffect() {
  return (
    <div className="cosmos-pointer-layer" aria-hidden="true">
      <span className="cosmos-pointer-layer__stars cosmos-pointer-layer__stars--far" />
      <span className="cosmos-pointer-layer__stars cosmos-pointer-layer__stars--near" />
      <span className="cosmos-pointer-layer__dust" />
    </div>
  );
}

export default function Footer(){
  return (
    <footer>
      <div className="wrap" style={{display:"flex",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}>
        <div>© 2025 NeuroMind33 — Software con visión</div>
        <div style={{display:"flex",gap:16}}>
          <a href="#">Política de privacidad</a>
          <a href="#">Términos</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

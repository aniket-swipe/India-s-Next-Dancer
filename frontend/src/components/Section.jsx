export default function Section({ id, className, children }) {
  return (
    <section id={id} className={className}>
      <div className="wrap">{children}</div>
    </section>
  )
}

function RecordFields({ fields }) {
  return (
    <dl className="print-record__fields">
      {fields.map((field) => (
        <div className="print-record__field" key={field.label}>
          <dt>{field.label}</dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function RecordSection({ title, children }) {
  return (
    <section className="print-record__section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export default function AnimalPrintRecord({ record }) {
  return (
    <article className="print-record" aria-label={`Ficha de ${record.name}`}>
      <header className="print-record__header">
        <img src="/clowder-wordmark.png" alt="Clowder" />
        <div>
          <p>Ficha del residente</p>
          <span>Generada el {record.generatedAt}</span>
        </div>
      </header>

      <div className="print-record__profile">
        {record.photo ? (
          <img className="print-record__photo" src={record.photo} alt={`Foto de ${record.name}`} />
        ) : (
          <div className="print-record__photo print-record__photo--empty">Sin foto</div>
        )}
        <div>
          <p className="print-record__eyebrow">Registro de bienestar</p>
          <h1>{record.name}</h1>
          <p>{record.species} · {record.breed}</p>
        </div>
      </div>

      <RecordSection title="Datos del residente">
        <RecordFields fields={record.identification} />
        <dl className="print-record__field print-record__description">
          <dt>Descripción y personalidad</dt>
          <dd>{record.description}</dd>
        </dl>
      </RecordSection>

      <RecordSection title="Salud y cuidados">
        <RecordFields fields={record.health} />
        <RecordFields fields={record.care} />
      </RecordSection>

      <RecordSection title="Gustos y preferencias">
        <RecordFields fields={record.preferences} />
      </RecordSection>

      <RecordSection title="Historial de peso">
        {record.weights.length ? (
          <table className="print-record__table">
            <thead><tr><th>Fecha</th><th>Peso</th></tr></thead>
            <tbody>
              {record.weights.map((weight, index) => (
                <tr key={`${weight.date}-${index}`}><td>{weight.date}</td><td>{weight.weight}</td></tr>
              ))}
            </tbody>
          </table>
        ) : <p className="print-record__empty">Sin registros de peso.</p>}
      </RecordSection>

      <RecordSection title="Bitácora cronológica">
        {record.logs.length ? record.logs.map((log, index) => (
          <div className="print-record__log" key={`${log.date}-${index}`}>
            <div className="print-record__log-meta"><span>{log.type}</span><span>{log.date}</span></div>
            <h3>{log.title}</h3>
            {log.description && <p>{log.description}</p>}
            {log.mood && <p className="print-record__mood">Estado de ánimo: {log.mood}</p>}
          </div>
        )) : <p className="print-record__empty">Sin registros en la bitácora.</p>}
      </RecordSection>
      <footer className="print-record__footer">Clowder · Información registrada en este dispositivo</footer>
    </article>
  )
}

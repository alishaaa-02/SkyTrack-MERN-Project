export default function RegisteredTrainees({
  filtered,
  search,
  setSearch,
  edit,
  remove
}) {
  return (
    <section id="trainees" className="section">
      <h2>Registered Trainees</h2>

      <input
        className="search"
        placeholder="Search trainees..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Program</th>
              <th>Experience</th>
              <th>Medical Certificate</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone}</td>
                <td>{t.program}</td>
                <td>{t.experience}</td>

                <td>
                  {t.medicalCertificate?.originalName ? (
                    <a
                      className="certificateLink"
                      href={`${import.meta.env.VITE_API_URL}/api/trainees/${t._id}/medical-certificate`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="missing">Not available</span>
                  )}
                </td>

                <td className="actionCell">
                  <button onClick={() => edit(t)}>
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={() => remove(t._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7">No trainees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
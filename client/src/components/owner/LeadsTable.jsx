import { Fragment, useState } from "react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function LeadsTable({ leads }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section className="panel stack-md">
      <div className="owner-header-row">
        <div>
          <p className="eyebrow">Captured Leads</p>
          <h2>Recent submissions</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Submitted</th>
              <th>Estimate Range</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const expanded = expandedId === lead._id;
              return (
                <Fragment key={lead._id}>
                  <tr onClick={() => setExpandedId(expanded ? null : lead._id)} className="lead-row">
                    <td>{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.email}</td>
                    <td>{new Date(lead.createdAt).toLocaleString()}</td>
                    <td>
                      {formatCurrency(lead.estimate_low)} - {formatCurrency(lead.estimate_high)}
                    </td>
                  </tr>
                  {expanded ? (
                    <tr className="details-row">
                      <td colSpan="5">
                        <pre>{JSON.stringify(lead.answers, null, 2)}</pre>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface EmailTemplateProps {
  title: string;
  description: string;
}

export const EmailTemplate = ({
  title,
  description,
}: EmailTemplateProps) => (
  <div>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);

interface SiteEmailTemplateProps {
  name: string;
  company: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
}

export const SiteEmailTemplate = ({
  name,
  company,
  email,
  phone,
  service_type,
  message,
}: SiteEmailTemplateProps) => (
  <div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p>Name: {name}</p>
      <p>Company: {company}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <p>Service Type: {service_type}</p>
      <p style={{ marginTop: '2rem' }}>Message: {message}</p>
    </div>
  </div>
);
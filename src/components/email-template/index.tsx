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

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p style={{ 
      fontWeight: '600',
      fontSize: '16px',
      marginBottom: '4px'
    }}>
      {label}:
    </p>
    <p style={{ 
      backgroundColor: '#f5f5f5',
      padding: '10px',
      borderRadius: '6px',
      margin: 0
    }}>
      {value}
    </p>
  </div>
);

export const SiteEmailTemplate = ({
  name,
  company,
  email,
  phone,
  service_type,
  message,
}: SiteEmailTemplateProps) => (
  <div style={{ 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    color: '#333'
  }}>
    <h1 style={{ 
      color: '#1a1a1a', 
      fontSize: '24px',
      marginBottom: '30px',
      textAlign: 'center' as const,
      borderBottom: '1px solid #eee',
      paddingBottom: '15px'
    }}>
      New Lead Received
    </h1>

    <div style={{ 
      display: 'grid',
      gap: '15px'
    }}>
      <Field label="Name" value={name} />
      <Field label="Company" value={company} />
      <Field label="Email" value={email} />
      <Field label="Phone" value={phone} />
      <Field label="Service Type" value={service_type} />
      
      <div style={{ marginTop: '25px' }}>
        <p style={{ 
          fontWeight: '600',
          fontSize: '16px',
          marginBottom: '8px'
        }}>
          Message:
        </p>
        <p style={{ 
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '6px',
          whiteSpace: 'pre-wrap',
          margin: 0
        }}>
          {message}
        </p>
      </div>
    </div>
  </div>
);
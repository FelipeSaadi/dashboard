import styles from "./index.module.css";
import { useRouter } from "next/navigation";

interface Feature {
  title: string;
  icon: React.ReactNode;
  description: string;
  url: string;
}

export const Features = ({ features }: { features: Feature[] }) => {
  const router = useRouter();

  return (
    <div>
      <div className={styles.featureGrid}>
        {
          features.map((feature, index) => (
            <div key={index} className={styles.featureBox}>
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <div className={styles.featureTitle}>
                {feature.title}
              </div>
              <div className={styles.featureDescription}>
                {feature.description}
              </div>
              <button
                className={styles.continueButton}
                onClick={() => router.push(feature.url)}
              >
                Continue
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
};
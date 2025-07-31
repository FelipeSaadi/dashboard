import styles from "./index.module.css";
import { useRouter } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";

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
      <Box p={4} display="flex" alignItems="center" gap={2}>
        <Text marginX={"5"} fontSize="32px" fontWeight="regular" color="#828282">
          Select a Feature or Start a Chat
        </Text>
      </Box>
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
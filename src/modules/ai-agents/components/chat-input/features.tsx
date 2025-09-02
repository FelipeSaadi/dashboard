import styles from "./index.module.css";
import { useRouter } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { useState } from "react";

interface Feature {
  title: string;
  icon: React.ReactNode;
  description: string;
  url: string | null;
}

export const Features = ({ features }: { features: Feature[] }) => {
  const router = useRouter();
  const [featureHover, setFeatureHover] = useState<number | null>(null);

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
            <div key={index} className={styles.featureBox} onMouseEnter={() => setFeatureHover(index)} onMouseLeave={() => setFeatureHover(null)}>
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              {
                !feature.url ? (
                  <div>
                      <div className={styles.featureTitle}>
                        <LockIcon marginRight={"2"}/>
                        <span>{feature.title}</span>
                      </div>
                      <div className={styles.featureDescription}>
                        {feature.description}
                      </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.featureTitle}>
                      {feature.title}
                    </div>
                    <div className={styles.featureDescription}>
                      {feature.description}
                    </div>
                  </>
                )
              }
              <button
                className={`${styles.continueButton} ${feature.url ? '' : styles.continueButtonDisabled}`}
                onClick={() => feature.url && router.push(feature.url)}
              >
                {!feature.url && featureHover === index ? "Coming Soon" : "Continue"}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
};
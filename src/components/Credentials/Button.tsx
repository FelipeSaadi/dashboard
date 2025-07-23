"use client"

import { useState } from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { ApiCredentialsModal } from "./Modal";

export const ApiCredentialsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <Button
        leftIcon={<FaLock />}
        onClick={() => setIsOpen(true)}
        size="md"
        backgroundColor="var(--background-secondary)"
        color="var(--text-primary)"
        _hover={{
          backgroundColor: "var(--background-primary)"
        }}
        variant="solid"
      >
        API Keys
      </Button> */}
      <IconButton
              aria-label="Alert"
              onClick={() => setIsOpen(true)}
              variant="outline"
              bgColor="transparent"
              borderRadius="full"
              color="white"
              _hover={{
                bgColor: "transparent",
                color: "grey",
              }}
              border="1px solid grey"
              icon={<FaLock width="14px" height="14px" />}
            />

      <ApiCredentialsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

"use client"

import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { ApiCredentialsModal } from "./Modal";

export const ApiCredentialsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        leftIcon={<FaLock />}
        onClick={() => setIsOpen(true)}
        height={42}
        backgroundColor="white"
        color="black"
        fontWeight="normal"
        rounded={'25px'}
        _hover={{
          backgroundColor: "grey"
        }}
        variant="solid"
      >
        API Keys
      </Button>
      <ApiCredentialsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

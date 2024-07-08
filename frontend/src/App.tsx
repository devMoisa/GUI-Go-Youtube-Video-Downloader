import { useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Icon,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa6";
import { Downloader } from "../wailsjs/go/main/App";
import { useToast } from "@chakra-ui/react";

function App() {
  const [videoURL, setVideoURL] = useState("");
  const [savePath, setSavePath] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const toast = useToast();

  const handleDownload = async () => {
    try {
      if (videoURL.length === 0) {
        toast({
          title: "You must fill the url Video Input.",
          description: "Fill the input video URL with your target video.",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });

        return;
      }

      if (savePath.length === 0) {
        toast({
          title: "You must fill the url Video Input.",
          description: "Fill the input video URL with your target video.",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });

        return;
      }

      setIsApiLoading(true);
      const result = await Downloader(videoURL, savePath);
      alert(result);
      toast({
        title: "Video downloaded with success.",
        description: "You can watch the video in folder selected.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Sorry the video can't be downloaded.",
        description: "Fix the url or choose other video to download.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error(error);
      alert("Download failed");
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <>
      {!isApiLoading && (
        <Flex
          height={"100vh"}
          w={"100vw"}
          bg={"#282a36"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Icon as={FaPlay} color={"orange"} fontSize={"30px"} />
          <Text
            textAlign={"center"}
            fontSize={"3xl"}
            fontWeight={"700"}
            color={"#fff"}
            mt={"10px"}
          >
            Belmotube Video <br /> Downloader
          </Text>
          <Divider
            opacity={"10%"}
            mt={"40px"}
            orientation="horizontal"
            maxW={"400px"}
          />
          <Flex
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            maxWidth={"450px"}
            width={"100%"}
            mt={"30px"}
            flexDir={"column"}
          >
            <Text mb={"10px"} fontWeight={"500"} color={"#fff"}>
              Insira no campo abaixo o link do video
            </Text>
            <Input
              size={"lg"}
              variant="filled"
              colorScheme="orange"
              placeholder="ex: http:www.youtube.com/..."
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              fontSize={"13px"}
              fontWeight={"700"}
              _hover={{ color: "red" }}
              _active={{ color: "#fff" }}
              _focus={{ color: "#fff" }}
            />

            <Text mt={"20px"} mb={"10px"} fontWeight={"500"} color={"#fff"}>
              Paste the directory target to save video:
            </Text>
            <Input
              size={"lg"}
              fontSize={"15px"}
              fontWeight={"700"}
              variant="filled"
              placeholder="ex: C:\Users\BelmoTube\Videos"
              value={savePath}
              onChange={(e) => setSavePath(e.target.value)}
              _hover={{ color: "red" }}
              _focus={{ color: "#fff" }}
            />
            <Button
              colorScheme="messenger"
              size={"lg"}
              mt={"20px"}
              width={"100%"}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Flex>
        </Flex>
      )}

      {isApiLoading && (
        <Flex
          height={"100vh"}
          w={"100vw"}
          bg={"#282a36"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text mt={"20px"} fontSize={"25px"} fontWeight={"900"} color={"#fff"}>
            Downloading...
          </Text>
        </Flex>
      )}
    </>
  );
}

export default App;

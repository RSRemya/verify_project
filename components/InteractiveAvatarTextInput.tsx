import { Input, Spinner, Tooltip } from "@nextui-org/react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import clsx from "clsx";

interface StreamingAvatarTextInputProps {
  label: string;
  placeholder: string;
  input: string;
  onSubmit: (text: string) => Promise<void>; // Updated to async
  setInput: (value: string) => void;
  endContent?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export default function InteractiveAvatarTextInput({
  label,
  placeholder,
  input,
  onSubmit,
  setInput,
  endContent,
  disabled = false,
  loading = false,
}: StreamingAvatarTextInputProps) {
  async function fetchMockResponse(userInput: string): Promise<string> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MOCK_API_URL}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: userInput }),
        }
      );
      const data = await response.json();
      return data.reply || "I didn't get a response";
    } catch (error) {
      console.error("API Error:", error);
      return "Sorry, I couldn't connect to the API";
    }
  }

  async function handleSubmit() {
    if (input.trim() === "") return;
    const apiResponse = await fetchMockResponse(input);
    await onSubmit(apiResponse);
    setInput("");
  }

  return (
    <Input
      endContent={
        <div className="flex flex-row items-center h-full">
          {endContent}
          <Tooltip content="Send message">
            {loading ? (
              <Spinner className="text-indigo-300 hover:text-indigo-200" size="sm" />
            ) : (
              <button
                type="submit"
                className="focus:outline-none"
                onClick={handleSubmit}
                disabled={disabled}
              >
                <PaperPlaneRight
                  className={clsx(
                    "text-indigo-300 hover:text-indigo-200",
                    disabled && "opacity-50"
                  )}
                  size={24}
                />
              </button>
            )}
          </Tooltip>
        </div>
      }
      label={label}
      placeholder={placeholder}
      size="sm"
      value={input}
      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      onValueChange={setInput}
      isDisabled={disabled}
    />
  );
}

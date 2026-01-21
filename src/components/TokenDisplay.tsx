import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TokenDisplayProps {
  tokens: number;
  onBuyTokens: () => void;
}

const TokenDisplay = ({ tokens, onBuyTokens }: TokenDisplayProps) => {
  const isLow = tokens <= 3;
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
          isLow 
            ? "border-destructive/50 bg-destructive/10 text-destructive" 
            : "border-border bg-secondary/50 text-foreground"
        }`}
      >
        <Coins className="w-4 h-4" />
        <span className="font-medium text-sm">{tokens}</span>
      </div>
      <Button
        onClick={onBuyTokens}
        variant="outline"
        size="sm"
        className="h-8 text-xs"
      >
        + Tokens
      </Button>
    </div>
  );
};

export default TokenDisplay;

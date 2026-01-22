import { Coins, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TokenDisplayProps {
  tokens: number;
  dailyLimit?: number;
  onBuyTokens: () => void;
}

const TokenDisplay = ({ tokens, dailyLimit, onBuyTokens }: TokenDisplayProps) => {
  const isLow = tokens <= 3;
  const percentage = dailyLimit ? (tokens / dailyLimit) * 100 : 100;
  
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors cursor-help ${
                isLow 
                  ? "border-destructive/50 bg-destructive/10 text-destructive" 
                  : "border-border bg-secondary/50 text-foreground"
              }`}
            >
              <Coins className="w-4 h-4" />
              <span className="font-medium text-sm">
                {tokens}
                {dailyLimit && dailyLimit < 999999 && (
                  <span className="text-xs opacity-60">/{dailyLimit}</span>
                )}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs space-y-1">
              <p className="font-medium">Tokens disponíveis hoje</p>
              {dailyLimit && dailyLimit < 999999 && (
                <>
                  <p>Limite diário: {dailyLimit} tokens</p>
                  <p>Usado: {Math.round(percentage)}%</p>
                  <p className="text-muted-foreground">Reset às 00:00</p>
                </>
              )}
              {dailyLimit && dailyLimit >= 999999 && (
                <p className="text-green-500">Tokens ilimitados!</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        onClick={onBuyTokens}
        variant="outline"
        size="sm"
        className="h-8 text-xs"
      >
        Planos
      </Button>
    </div>
  );
};

export default TokenDisplay;

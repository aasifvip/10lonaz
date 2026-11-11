import { useState, useEffect } from "react";
import { Settings, MousePointer, Palette, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface CursorPreferences {
  aiMode: boolean;
  cursorTheme: "auto" | "light" | "dark";
  reducedMotion: boolean;
}

interface CursorSettingsProps {
  preferences: CursorPreferences;
  onPreferencesChange: (prefs: CursorPreferences) => void;
}

export function CursorSettings({ preferences, onPreferencesChange }: CursorSettingsProps) {
  const [open, setOpen] = useState(false);

  const updatePreference = <K extends keyof CursorPreferences>(
    key: K,
    value: CursorPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    onPreferencesChange(newPreferences);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-[9997] rounded-full shadow-lg"
          aria-label="Cursor Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Cursor Settings</h4>
            <p className="text-sm text-muted-foreground">
              Customize your cursor experience
            </p>
          </div>

          <div className="space-y-4">
            {/* AI Mouse Mode */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <MousePointer className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="ai-mode" className="cursor-pointer">
                  AI Mouse Mode
                </Label>
              </div>
              <Switch
                id="ai-mode"
                checked={preferences.aiMode}
                onCheckedChange={(checked) => updatePreference("aiMode", checked)}
              />
            </div>

            {/* Cursor Theme */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <Label>Cursor Theme</Label>
              </div>
              <RadioGroup
                value={preferences.cursorTheme}
                onValueChange={(value) =>
                  updatePreference("cursorTheme", value as CursorPreferences["cursorTheme"])
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="theme-auto" />
                  <Label htmlFor="theme-auto" className="cursor-pointer">
                    Auto (follows system)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="cursor-pointer">
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="cursor-pointer">
                    Dark
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Minimize2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="reduced-motion" className="cursor-pointer">
                  Reduce Motion
                </Label>
              </div>
              <Switch
                id="reduced-motion"
                checked={preferences.reducedMotion}
                onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

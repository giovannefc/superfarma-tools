import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface HeaderTabsProps {
  tabs: {
    name: string;
    to: string;
  }[];
  children?: ReactNode;
}

export function HeaderTabs({ tabs, children }: HeaderTabsProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab =
    tabs.find(tab => location.pathname === tab.to)?.to || tabs[0].to;

  const handleTabChange = (value: string) => {
    navigate(value);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Desktop tabs */}
          <div className="hidden sm:block">
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList>
                {tabs.map(tab => (
                  <TabsTrigger key={tab.name} value={tab.to} asChild>
                    <NavLink to={tab.to}>{tab.name}</NavLink>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile select */}
          <div className="sm:hidden">
            <Select value={currentTab} onValueChange={handleTabChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map(tab => (
                  <SelectItem key={tab.name} value={tab.to}>
                    {tab.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {children && <div className="ml-4">{children}</div>}
      </div>
    </div>
  );
}

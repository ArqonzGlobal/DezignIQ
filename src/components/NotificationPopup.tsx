import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
  {
    id: 1,
    title: "New booking request",
    message: "John Doe requested a consultation for interior design",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Project update",
    message: "Your architectural plan has been reviewed",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Payment received",
    message: "Payment of $500 has been received for Project X",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: 4,
    title: "New message",
    message: "Sarah sent you a message about the ongoing project",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 5,
    title: "Reminder",
    message: "Meeting scheduled for tomorrow at 10 AM",
    time: "1 day ago",
    unread: false,
  },
];

export const NotificationPopup = () => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <ScrollArea className="h-96">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors ${
                  notification.unread ? "bg-accent/20" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {notification.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full text-sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

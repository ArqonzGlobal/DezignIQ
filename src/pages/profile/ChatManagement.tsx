import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Archive, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockConversations = [
  {
    id: "1",
    senderName: "Rahul Sharma",
    lastMessage: "Thanks for the quote. When can we start?",
    unread: 2,
    online: true,
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    senderName: "Priya Patel",
    lastMessage: "Can you share more details about the property?",
    unread: 0,
    online: false,
    timestamp: "Yesterday",
  },
  {
    id: "3",
    senderName: "Amit Kumar",
    lastMessage: "Perfect! I'll finalize the order today.",
    unread: 1,
    online: true,
    timestamp: "2 hours ago",
  },
];

const mockMessages = [
  { id: "1", sender: "Rahul Sharma", message: "Hi, I'm interested in your services", time: "10:15 AM", isOwn: false },
  { id: "2", sender: "You", message: "Hello! Thank you for reaching out. How can I help?", time: "10:20 AM", isOwn: true },
  { id: "3", sender: "Rahul Sharma", message: "Can you provide a quote for interior design?", time: "10:25 AM", isOwn: false },
  { id: "4", sender: "You", message: "Sure! I'd be happy to provide a quote. Could you share more details?", time: "10:27 AM", isOwn: true },
  { id: "5", sender: "Rahul Sharma", message: "Thanks for the quote. When can we start?", time: "10:30 AM", isOwn: false },
];

export default function ChatManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chat</h1>
        <p className="text-muted-foreground">Communicate with customers and leads</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 h-[600px]">
        <Card className="md:col-span-1 p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedChat.id === conv.id ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 bg-muted" />
                      {conv.online && (
                        <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-success text-success" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold truncate">{conv.senderName}</p>
                        {conv.unread > 0 && (
                          <Badge variant="default" className="ml-2 h-5 px-1.5 text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conv.timestamp}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-muted" />
              <div>
                <p className="font-semibold">{selectedChat.senderName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {selectedChat.online && <Circle className="h-2 w-2 fill-success text-success" />}
                  {selectedChat.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setMessage("");
                  }
                }}
              />
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

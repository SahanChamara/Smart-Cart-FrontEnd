"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { UserManagement } from "@/components/user-management"
import { BranchSettings } from "@/components/branch-settings"

export default function SettingsPage() {
  const { toast } = useToast()
  const [storeSettings, setStoreSettings] = useState({
    storeName: "My POS Store",
    address: "123 Main Street, City, Country",
    phone: "0712345678",
    email: "contact@myposstore.com",
    taxRate: "10",
    currency: "USD",
    receiptFooter: "Thank you for shopping with us!",
    enableLoyaltyProgram: true,
    pointsPerPurchase: "1",
    pointsRedemptionValue: "0.1",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    lowStockThreshold: "10",
    salesSummary: true,
    customerBirthday: true,
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleStoreToggleChange = (name: string, checked: boolean) => {
    setStoreSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNotificationSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggleChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList>
          <TabsTrigger value="store">Store Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="branches">Branch Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Manage your store details and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={storeSettings.storeName}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={storeSettings.email} onChange={handleStoreSettingsChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={storeSettings.phone} onChange={handleStoreSettingsChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) => setStoreSettings((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="LKR">LKR (Rs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    value={storeSettings.taxRate}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={storeSettings.address}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiptFooter">Receipt Footer Message</Label>
                <Textarea
                  id="receiptFooter"
                  name="receiptFooter"
                  value={storeSettings.receiptFooter}
                  onChange={handleStoreSettingsChange}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Loyalty Program</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableLoyaltyProgram"
                    checked={storeSettings.enableLoyaltyProgram}
                    onCheckedChange={(checked) => handleStoreToggleChange("enableLoyaltyProgram", checked)}
                  />
                  <Label htmlFor="enableLoyaltyProgram">Enable Loyalty Program</Label>
                </div>

                {storeSettings.enableLoyaltyProgram && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pointsPerPurchase">Points per $1 spent</Label>
                      <Input
                        id="pointsPerPurchase"
                        name="pointsPerPurchase"
                        type="number"
                        min="0"
                        step="0.1"
                        value={storeSettings.pointsPerPurchase}
                        onChange={handleStoreSettingsChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pointsRedemptionValue">Value per point ($)</Label>
                      <Input
                        id="pointsRedemptionValue"
                        name="pointsRedemptionValue"
                        type="number"
                        min="0"
                        step="0.01"
                        value={storeSettings.pointsRedemptionValue}
                        onChange={handleStoreSettingsChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="branches">
          <BranchSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure alerts and notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Inventory Alerts</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="lowStockAlerts"
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => handleNotificationToggleChange("lowStockAlerts", checked)}
                  />
                  <Label htmlFor="lowStockAlerts">Enable Low Stock Alerts</Label>
                </div>

                {notificationSettings.lowStockAlerts && (
                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      name="lowStockThreshold"
                      type="number"
                      min="0"
                      value={notificationSettings.lowStockThreshold}
                      onChange={handleNotificationSettingsChange}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Report Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="salesSummary"
                      checked={notificationSettings.salesSummary}
                      onCheckedChange={(checked) => handleNotificationToggleChange("salesSummary", checked)}
                    />
                    <Label htmlFor="salesSummary">Daily Sales Summary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="customerBirthday"
                      checked={notificationSettings.customerBirthday}
                      onCheckedChange={(checked) => handleNotificationToggleChange("customerBirthday", checked)}
                    />
                    <Label htmlFor="customerBirthday">Customer Birthday Reminders</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Methods</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationToggleChange("emailNotifications", checked)}
                    />
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationToggleChange("smsNotifications", checked)}
                    />
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage your data backup and restoration options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Manual Backup</h3>
                <p className="text-sm text-muted-foreground">
                  Create a backup of your current data. This includes all products, customers, sales, and settings.
                </p>
                <Button>Create Backup</Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Automatic Backups</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="autoBackup" />
                  <Label htmlFor="autoBackup">Enable Automatic Backups</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backupFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Restore Data</h3>
                <p className="text-sm text-muted-foreground">
                  Restore your data from a previous backup. This will replace all current data.
                </p>
                <div className="flex items-center gap-2">
                  <Input type="file" />
                  <Button variant="outline">Restore</Button>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex items-center gap-2">
                  <div className="text-destructive">
                    <h3 className="text-lg font-medium">Data Reset</h3>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all data. This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive" className="ml-auto">
                    Reset All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

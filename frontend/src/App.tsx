import React, { Component } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

export default class App extends Component {
  render() {
    return (
      <div>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              Track progress and recent activity for your Vite app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Your design system is ready. Start building your next component.
          </CardContent>
        </Card>
      </div>
    )
  }
}

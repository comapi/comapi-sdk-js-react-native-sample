//
//  RCTDotdigitalModule.m
//  PushTest
//
//  Created by Stevan Lepojevic on 09/06/2022.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>

#import "RCTDotdigitalModule.h"

@implementation RCTDotdigitalModule

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
  RCTLogInfo(@"getName called");
  return [[UIDevice currentDevice] name];
}

RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_METHOD(createCalendarEventWithCallbck:(NSString *)title location:(NSString *)location callback: (RCTResponseSenderBlock)callback)
{
  NSInteger eventId = 1;
  callback(@[@(eventId)]);
  RCTLogInfo(@"Pretending to create an event %@ at %@", title, location);
}

RCT_EXPORT_METHOD(getPlatform:(RCTResponseSenderBlock)callback)
{
  NSDictionary *resultsDict = [NSDictionary dictionaryWithObjectsAndKeys: @"iOS",@"platform", nil];
  callback(@[[NSNull null] ,resultsDict ]);
}

@end

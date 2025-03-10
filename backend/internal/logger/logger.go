package logger

import (
	"github.com/Brower/backend/internal/config"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	// Log 全局日志实例
	Log *zap.Logger
	// Sugar 全局 Sugar 日志实例
	Sugar *zap.SugaredLogger
)

// InitLogger 初始化日志
func InitLogger(cfg *config.Config) error {
	// 解析日志级别
	level, err := getLogLevel(cfg.Logger.Level)
	if err != nil {
		return err
	}

	// 创建编码器配置
	encoderConfig := zapcore.EncoderConfig{
		MessageKey:     cfg.Logger.EncodingConfig.MessageKey,
		LevelKey:       cfg.Logger.EncodingConfig.LevelKey,
		TimeKey:        cfg.Logger.EncodingConfig.TimeKey,
		NameKey:        cfg.Logger.EncodingConfig.NameKey,
		CallerKey:      cfg.Logger.EncodingConfig.CallerKey,
		StacktraceKey:  cfg.Logger.EncodingConfig.StacktraceKey,
		LineEnding:     cfg.Logger.EncodingConfig.LineEnding,
		EncodeLevel:    zapcore.CapitalLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.StringDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	}

	// 创建 Zap 配置
	zapConfig := zap.Config{
		Level:             zap.NewAtomicLevelAt(level),
		Development:       cfg.Server.Mode == "debug",
		DisableCaller:     false,
		DisableStacktrace: false,
		Sampling:          nil,
		Encoding:          cfg.Logger.Encoding,
		EncoderConfig:     encoderConfig,
		OutputPaths:       cfg.Logger.OutputPaths,
		ErrorOutputPaths:  cfg.Logger.ErrorOutputPaths,
	}

	// 构建日志实例
	logger, err := zapConfig.Build(zap.AddCallerSkip(1))
	if err != nil {
		return err
	}

	// 替换全局实例
	Log = logger
	Sugar = logger.Sugar()
	zap.ReplaceGlobals(logger)

	return nil
}

// getLogLevel 将字符串日志级别转换为 zapcore.Level
func getLogLevel(level string) (zapcore.Level, error) {
	switch level {
	case "debug":
		return zapcore.DebugLevel, nil
	case "info":
		return zapcore.InfoLevel, nil
	case "warn":
		return zapcore.WarnLevel, nil
	case "error":
		return zapcore.ErrorLevel, nil
	case "dpanic":
		return zapcore.DPanicLevel, nil
	case "panic":
		return zapcore.PanicLevel, nil
	case "fatal":
		return zapcore.FatalLevel, nil
	default:
		return zapcore.InfoLevel, nil
	}
}

// Debug 输出 Debug 级别日志
func Debug(msg string, fields ...zap.Field) {
	Log.Debug(msg, fields...)
}

// Info 输出 Info 级别日志
func Info(msg string, fields ...zap.Field) {
	Log.Info(msg, fields...)
}

// Warn 输出 Warn 级别日志
func Warn(msg string, fields ...zap.Field) {
	Log.Warn(msg, fields...)
}

// Error 输出 Error 级别日志
func Error(msg string, fields ...zap.Field) {
	Log.Error(msg, fields...)
}

// DPanic 输出 DPanic 级别日志
func DPanic(msg string, fields ...zap.Field) {
	Log.DPanic(msg, fields...)
}

// Panic 输出 Panic 级别日志
func Panic(msg string, fields ...zap.Field) {
	Log.Panic(msg, fields...)
}

// Fatal 输出 Fatal 级别日志
func Fatal(msg string, fields ...zap.Field) {
	Log.Fatal(msg, fields...)
}

// Debugf 输出格式化的 Debug 级别日志
func Debugf(format string, args ...interface{}) {
	Sugar.Debugf(format, args...)
}

// Infof 输出格式化的 Info 级别日志
func Infof(format string, args ...interface{}) {
	Sugar.Infof(format, args...)
}

// Warnf 输出格式化的 Warn 级别日志
func Warnf(format string, args ...interface{}) {
	Sugar.Warnf(format, args...)
}

// Errorf 输出格式化的 Error 级别日志
func Errorf(format string, args ...interface{}) {
	Sugar.Errorf(format, args...)
}

// DPanicf 输出格式化的 DPanic 级别日志
func DPanicf(format string, args ...interface{}) {
	Sugar.DPanicf(format, args...)
}

// Panicf 输出格式化的 Panic 级别日志
func Panicf(format string, args ...interface{}) {
	Sugar.Panicf(format, args...)
}

// Fatalf 输出格式化的 Fatal 级别日志
func Fatalf(format string, args ...interface{}) {
	Sugar.Fatalf(format, args...)
}
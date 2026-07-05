#include <jni.h>
#include <string>

// ==========================================
// NATIVE CORE ENGINE
// ==========================================

const char* DECOY_KEY = "AES_KEY_IS_SUPER_SECRET_99182";
const char* DECOY_BACKDOOR = "ADMIN_OVERRIDE_12345";

const char XOR_KEY = 0x5A;

const unsigned char ENC_E2E_KEY[] = { 
    0x63, 0x63, 0x62, 0x62, 0x6d, 0x6d, 0x6c, 0x6c, 0x6f, 0x6f, 0x6e, 0x6e, 0x69, 0x69, 0x68, 0x68, 
    0x6b, 0x6b, 0x6a, 0x6a, 0x3b, 0x3b, 0x38, 0x38, 0x39, 0x39, 0x3e, 0x3e, 0x3f, 0x3f, 0x3c, 0x3c
};

const unsigned char ENC_BACKDOOR[] = {
    0x6a, 0x17, 0x69, 0x1d, 0x6e, 0x05, 0x0a, 0x08, 0x6a, 0x0e, 0x6a, 0x19, 0x6a, 0x16, 0x05, 0x63, 0x63
};

std::string decrypt(const unsigned char* encrypted, size_t length) {
    std::string result(length, '\0');
    for (size_t i = 0; i < length; i++) {
        result[i] = encrypted[i] ^ XOR_KEY;
    }
    return result;
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_ctf_vault_MainActivity_getE2EKey(JNIEnv* env, jobject /* this */) {
    std::string key = decrypt(ENC_E2E_KEY, sizeof(ENC_E2E_KEY));
    return env->NewStringUTF(key.c_str());
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_ctf_vault_MainActivity_getBackdoor(JNIEnv* env, jobject /* this */) {
    std::string backdoor = decrypt(ENC_BACKDOOR, sizeof(ENC_BACKDOOR));
    return env->NewStringUTF(backdoor.c_str());
}
